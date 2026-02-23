import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: List all payouts (admin)
export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all"; // all | pending | processing | completed | rejected
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {};
    if (status !== "all") where.status = status;

    const [payouts, total] = await Promise.all([
      prisma.payout.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.payout.count({ where }),
    ]);

    return NextResponse.json({ payouts, total, hasMore: offset + limit < total });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: Update payout status (admin)
export async function PUT(req: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { payoutId, status, rejectedReason } = body;

    if (!payoutId || !status) {
      return NextResponse.json({ error: "payoutId and status required" }, { status: 400 });
    }

    const validStatuses = ["pending", "processing", "completed", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const payout = await prisma.payout.findUnique({
      where: { id: payoutId },
      include: { user: { select: { id: true, balance: true } } },
    });

    if (!payout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { status };
    if (status === "completed") {
      updateData.processedAt = new Date();
    }
    if (status === "rejected") {
      updateData.rejectedReason = rejectedReason || "Rejected by admin";
      // Refund the user if rejecting
      if (payout.status !== "rejected") {
        await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: payout.userId },
            data: { balance: { increment: payout.amount } },
          });
          await tx.transaction.create({
            data: {
              userId: payout.userId,
              type: "admin_adjustment",
              amount: payout.amount,
              balanceBefore: payout.user.balance,
              balanceAfter: payout.user.balance + payout.amount,
              description: `Refund for rejected withdrawal #${payout.id}`,
              metadata: JSON.stringify({ payoutId: payout.id, reason: rejectedReason }),
            },
          });
          await tx.notification.create({
            data: {
              userId: payout.userId,
              type: "cashout",
              title: "Withdrawal Rejected",
              message: `Your withdrawal of CAD ${payout.amount.toFixed(2)} was rejected. The amount has been refunded to your balance.`,
            },
          });
        });
      }
    }

    const updated = await prisma.payout.update({
      where: { id: payoutId },
      data: updateData,
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    // Notify on completion
    if (status === "completed") {
      await prisma.notification.create({
        data: {
          userId: payout.userId,
          type: "cashout",
          title: "Withdrawal Complete!",
          message: `Your withdrawal of CAD ${payout.amount.toFixed(2)} via ${payout.method} has been processed!`,
        },
      });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
