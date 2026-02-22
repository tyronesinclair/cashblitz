import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      balance: true,
      totalEarnings: true,
      streak: true,
      level: true,
      xp: true,
      lastLoginAt: true,
      lastSpinAt: true,
      referralCode: true,
      _count: {
        select: {
          userOffers: { where: { status: "active" } },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    balance: user.balance,
    totalEarnings: user.totalEarnings,
    streak: user.streak,
    level: user.level,
    xp: user.xp,
    lastLoginAt: user.lastLoginAt,
    lastSpinAt: user.lastSpinAt,
    referralCode: user.referralCode,
    activeOfferCount: user._count.userOffers,
  });
}
