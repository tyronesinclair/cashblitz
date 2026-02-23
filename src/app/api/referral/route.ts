import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

// GET: Get referral info (code, stats)
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true },
  });

  // Generate referral code if none exists
  if (!user?.referralCode) {
    const code = randomBytes(4).toString("hex").toUpperCase();
    user = await prisma.user.update({
      where: { id: session.user.id },
      data: { referralCode: code },
      select: { referralCode: true },
    });
  }

  // Get referral stats
  const [totalReferrals, completedReferrals, totalEarned] = await Promise.all([
    prisma.referral.count({ where: { referrerId: session.user.id } }),
    prisma.referral.count({ where: { referrerId: session.user.id, status: "completed" } }),
    prisma.referral.aggregate({
      where: { referrerId: session.user.id, status: "completed" },
      _sum: { bonusAmount: true },
    }),
  ]);

  return NextResponse.json({
    referralCode: user!.referralCode,
    referralLink: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/signup?ref=${user!.referralCode}`,
    totalReferrals,
    completedReferrals,
    totalEarned: totalEarned._sum.bonusAmount || 0,
  });
}
