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

  const [userCount, offerCount, activeOfferCount, totalEarnings, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.offer.count(),
    prisma.offer.count({ where: { isActive: true } }),
    prisma.user.aggregate({ _sum: { totalEarnings: true } }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, balance: true, createdAt: true, role: true },
    }),
  ]);

  return NextResponse.json({
    userCount,
    offerCount,
    activeOfferCount,
    totalEarnings: totalEarnings._sum.totalEarnings || 0,
    recentUsers,
  });
}
