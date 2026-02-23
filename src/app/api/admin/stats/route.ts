import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [
      userCount,
      offerCount,
      activeOfferCount,
      totalEarningsAgg,
      totalBalanceAgg,
      activeUserOffers,
      completedUserOffers,
      recentUsers,
      topEarners,
      premiumOfferCount,
      pendingPayouts,
      totalPayoutsAgg,
      totalTransactions,
      totalReferrals,
      totalSpins,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.offer.count(),
      prisma.offer.count({ where: { isActive: true } }),
      prisma.user.aggregate({ _sum: { totalEarnings: true } }),
      prisma.user.aggregate({ _sum: { balance: true } }),
      prisma.userOffer.count({ where: { status: "active" } }),
      prisma.userOffer.count({ where: { status: "completed" } }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, balance: true, totalEarnings: true, createdAt: true, role: true, streak: true, level: true },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { totalEarnings: "desc" },
        where: { role: "user" },
        select: { id: true, name: true, email: true, totalEarnings: true, level: true },
      }),
      prisma.offer.count({ where: { isPremium: true } }),
      prisma.payout.count({ where: { status: "pending" } }),
      prisma.payout.aggregate({ where: { status: "completed" }, _sum: { amount: true } }),
      prisma.transaction.count(),
      prisma.referral.count(),
      prisma.dailySpin.count(),
    ]);

    return NextResponse.json({
      userCount,
      offerCount,
      activeOfferCount,
      premiumOfferCount,
      totalEarnings: totalEarningsAgg._sum.totalEarnings || 0,
      totalBalance: totalBalanceAgg._sum.balance || 0,
      activeUserOffers,
      completedUserOffers,
      recentUsers,
      topEarners,
      pendingPayouts,
      totalPayoutsProcessed: totalPayoutsAgg._sum.amount || 0,
      totalTransactions,
      totalReferrals,
      totalSpins,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
