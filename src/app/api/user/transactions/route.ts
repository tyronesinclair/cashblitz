import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // earn | withdraw | spin | referral | daily_bonus | all
  const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") || "20") || 20), 100);
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0") || 0);

  const where: Record<string, unknown> = { userId: session.user.id };
  if (type && type !== "all") {
    where.type = type;
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({
    transactions,
    total,
    hasMore: offset + limit < total,
  });
}
