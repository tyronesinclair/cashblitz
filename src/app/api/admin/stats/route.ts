import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function isAdmin() {
  const session = await auth();
  return session?.user && (session.user as Record<string, unknown>).role === "admin";
}

export async function GET() {
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
      select: { id: true, name: true, email: true, balance: true, totalEarnings: true, createdAt: true, role: true },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { totalEarnings: "desc" },
      where: { role: "user" },
      select: { id: true, name: true, email: true, totalEarnings: true },
    }),
    prisma.offer.count({ where: { isPremium: true } }),
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
  });
}
