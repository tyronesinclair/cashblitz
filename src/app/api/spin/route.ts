import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const PRIZES = [
  { label: "C$0.05", amount: 0.05, weight: 25 },
  { label: "C$0.10", amount: 0.10, weight: 25 },
  { label: "C$0.15", amount: 0.15, weight: 20 },
  { label: "C$0.25", amount: 0.25, weight: 15 },
  { label: "C$0.50", amount: 0.50, weight: 8 },
  { label: "C$1.00", amount: 1.00, weight: 4 },
  { label: "C$2.00", amount: 2.00, weight: 2 },
  { label: "C$5.00", amount: 5.00, weight: 1 },
];

function getRandomPrize() {
  const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;
  for (const prize of PRIZES) {
    random -= prize.weight;
    if (random <= 0) return prize;
  }
  return PRIZES[0]; // fallback
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
}

// POST: Spin the wheel
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate prize server-side
    const prize = getRandomPrize();
    const now = new Date();

    // Atomically check cooldown, update balance, record spin, create transaction
    const [updatedUser, spin] = await prisma.$transaction(async (tx) => {
      // Fetch user inside transaction to prevent race conditions
      const user = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { lastSpinAt: true, balance: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Check cooldown: 1 free spin per calendar day (UTC)
      if (user.lastSpinAt && isSameDay(user.lastSpinAt, now)) {
        const tomorrow = new Date(now);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        tomorrow.setUTCHours(0, 0, 0, 0);
        const msUntilReset = tomorrow.getTime() - now.getTime();
        throw new Error(JSON.stringify({
          error: "Already spun today",
          nextSpinAt: tomorrow.toISOString(),
          cooldownMs: msUntilReset,
        }));
      }

      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: {
          balance: { increment: prize.amount },
          totalEarnings: { increment: prize.amount },
          lastSpinAt: now,
          xp: { increment: 10 }, // 10 XP for spinning
        },
        select: { balance: true },
      });

      const spin = await tx.dailySpin.create({
        data: {
          userId: session.user.id,
          prize: prize.label,
          amount: prize.amount,
        },
      });

      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: "spin",
          amount: prize.amount,
          balanceBefore: user.balance,
          balanceAfter: updatedUser.balance,
          description: `Daily spin: won ${prize.label}`,
          metadata: JSON.stringify({ spinId: spin.id, prize: prize.label }),
        },
      });

      await tx.notification.create({
        data: {
          userId: session.user.id,
          type: "reward",
          title: "Spin Winner!",
          message: `You won ${prize.label} from the daily spin!`,
        },
      });

      return [updatedUser, spin];
    });

    return NextResponse.json({
      prize: prize.label,
      amount: prize.amount,
      prizeIndex: PRIZES.findIndex((p) => p.label === prize.label),
      newBalance: updatedUser.balance,
      spinId: spin.id,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Check if it's our structured cooldown error
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.error === "Already spun today") {
          return NextResponse.json(parsed, { status: 429 });
        }
      } catch {
        // Not JSON, handle as regular error
      }
      if (error.message === "User not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: Check spin status (cooldown info)
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { lastSpinAt: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const now = new Date();
  const canSpin = !user.lastSpinAt || !isSameDay(user.lastSpinAt, now);

  let nextSpinAt = null;
  let cooldownMs = 0;
  if (!canSpin && user.lastSpinAt) {
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    nextSpinAt = tomorrow.toISOString();
    cooldownMs = tomorrow.getTime() - now.getTime();
  }

  return NextResponse.json({
    canSpin,
    lastSpinAt: user.lastSpinAt,
    nextSpinAt,
    cooldownMs,
  });
}
