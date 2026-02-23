import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, referralCode } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Account already exists" },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(password, 12);

    // Look up referrer if a referral code was provided
    let referrerId: string | null = null;
    if (referralCode && typeof referralCode === "string" && referralCode.length <= 20) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
        select: { id: true },
      });
      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // Generate a unique referral code for the new user
    const newReferralCode = crypto.randomBytes(4).toString("hex");

    const user = await prisma.user.create({
      data: {
        name: name || email.split("@")[0],
        email,
        password: hash,
        role: "user",
        balance: 0,
        referralCode: newReferralCode,
        referredBy: referrerId,
      },
    });

    // If referred by someone, create a pending Referral record
    if (referrerId) {
      await prisma.referral.create({
        data: {
          referrerId,
          referredId: user.id,
          bonusAmount: 5.0,
          status: "pending",
        },
      });
    }

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
