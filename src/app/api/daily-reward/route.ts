import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const DAILY_REWARDS = [
  { day: 1, amount: 0.05 },
  { day: 2, amount: 0.10 },
  { day: 3, amount: 0.15 },
  { day: 4, amount: 0.25 },
  { day: 5, amount: 0.50 },
  { day: 6, amount: 0.75 },
  { day: 7, amount: 2.00 },
];

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
}

function isConsecutiveDay(prev: Date, current: Date): boolean {
  const prevDay = new Date(prev);
  prevDay.setUTCDate(prevDay.getUTCDate() + 1);
  return isSameDay(prevDay, current);
}

// GET: Check daily reward status
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's recent daily rewards (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);

  const recentRewards = await prisma.dailyReward.findMany({
    where: {
      userId: session.user.id,
      claimedAt: { gte: sevenDaysAgo },
    },
    orderBy: { claimedAt: "desc" },
    take: 7,
  });

  const now = new Date();
  const claimedToday = recentRewards.some((r) => isSameDay(r.claimedAt, now));

  // Determine which day of the streak the user is on
  let currentStreakDay = 0;
  if (recentRewards.length > 0) {
    const lastReward = recentRewards[0];
    if (isSameDay(lastReward.claimedAt, now)) {
      // Already claimed today
      currentStreakDay = lastReward.day;
    } else if (isConsecutiveDay(lastReward.claimedAt, now)) {
      // Consecutive day - advance to next
      currentStreakDay = lastReward.day >= 7 ? 1 : lastReward.day + 1;
    } else {
      // Streak broken - reset to day 1
      currentStreakDay = 1;
    }
  } else {
    currentStreakDay = 1;
  }

  const nextReward = DAILY_REWARDS.find((r) => r.day === currentStreakDay) || DAILY_REWARDS[0];

  // Build 7-day calendar
  const calendar = DAILY_REWARDS.map((reward) => {
    const claimed = recentRewards.some((r) => r.day === reward.day && isSameDay(r.claimedAt, now) ||
      (reward.day < currentStreakDay && !claimedToday) ||
      (reward.day < (claimedToday ? currentStreakDay + 1 : currentStreakDay)));

    // More accurate: check if this day was claimed in the current streak
    const claimedInStreak = recentRewards.some((r) => r.day === reward.day);

    return {
      ...reward,
      claimed: claimedInStreak && reward.day < currentStreakDay ||
               (claimedToday && reward.day <= currentStreakDay),
      isToday: reward.day === currentStreakDay && !claimedToday,
      isNext: reward.day === currentStreakDay,
    };
  });

  return NextResponse.json({
    calendar,
    claimedToday,
    currentStreakDay,
    nextReward: claimedToday ? null : nextReward,
    streak: currentStreakDay,
  });
}

// POST: Claim today's daily reward
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true, streak: true, lastLoginAt: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if already claimed today
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const todayClaim = await prisma.dailyReward.findFirst({
    where: {
      userId: session.user.id,
      claimedAt: { gte: startOfDay, lte: endOfDay },
    },
  });

  if (todayClaim) {
    return NextResponse.json({ error: "Already claimed today" }, { status: 400 });
  }

  // Determine current streak day
  const yesterday = new Date(now);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const startOfYesterday = new Date(yesterday);
  startOfYesterday.setUTCHours(0, 0, 0, 0);
  const endOfYesterday = new Date(yesterday);
  endOfYesterday.setUTCHours(23, 59, 59, 999);

  const yesterdayClaim = await prisma.dailyReward.findFirst({
    where: {
      userId: session.user.id,
      claimedAt: { gte: startOfYesterday, lte: endOfYesterday },
    },
    orderBy: { claimedAt: "desc" },
  });

  let streakDay = 1;
  if (yesterdayClaim) {
    streakDay = yesterdayClaim.day >= 7 ? 1 : yesterdayClaim.day + 1;
  }

  const reward = DAILY_REWARDS.find((r) => r.day === streakDay) || DAILY_REWARDS[0];

  // Atomically credit balance and record reward
  const [updatedUser, dailyReward] = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: session.user.id },
      data: {
        balance: { increment: reward.amount },
        totalEarnings: { increment: reward.amount },
        streak: streakDay,
        lastLoginAt: now,
        xp: { increment: 25 }, // 25 XP for daily login
      },
      select: { balance: true, streak: true },
    });

    const dailyReward = await tx.dailyReward.create({
      data: {
        userId: session.user.id,
        day: streakDay,
        amount: reward.amount,
      },
    });

    await tx.transaction.create({
      data: {
        userId: session.user.id,
        type: "daily_bonus",
        amount: reward.amount,
        balanceBefore: user.balance,
        balanceAfter: updatedUser.balance,
        description: `Day ${streakDay} daily login bonus: $${reward.amount.toFixed(2)}`,
        metadata: JSON.stringify({ day: streakDay }),
      },
    });

    await tx.notification.create({
      data: {
        userId: session.user.id,
        type: "reward",
        title: `Day ${streakDay} Bonus!`,
        message: `You earned $${reward.amount.toFixed(2)} for your Day ${streakDay} login streak!`,
      },
    });

    return [updatedUser, dailyReward];
  });

  return NextResponse.json({
    claimed: true,
    day: streakDay,
    amount: reward.amount,
    newBalance: updatedUser.balance,
    newStreak: updatedUser.streak,
    rewardId: dailyReward.id,
  });
}
