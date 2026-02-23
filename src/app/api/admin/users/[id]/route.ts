import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAdmin, getAuthUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, role: true, balance: true,
      totalEarnings: true, level: true, streak: true, createdAt: true, updatedAt: true,
      userOffers: {
        include: { offer: { select: { name: true, totalReward: true } } },
        orderBy: { startedAt: "desc" },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const adminId = await getAuthUserId();

  // Only allow updating certain fields
  const allowedFields: Record<string, unknown> = {};
  if (body.role !== undefined) allowedFields.role = body.role;
  if (body.balance !== undefined) allowedFields.balance = parseFloat(body.balance);
  if (body.totalEarnings !== undefined) allowedFields.totalEarnings = parseFloat(body.totalEarnings);
  if (body.level !== undefined) allowedFields.level = parseInt(body.level);
  if (body.streak !== undefined) allowedFields.streak = parseInt(body.streak);
  if (body.name !== undefined) allowedFields.name = body.name;

  // If balance is being changed, create an audit trail
  const isBalanceChange = body.balance !== undefined;
  let oldBalance = 0;

  if (isBalanceChange) {
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { balance: true },
    });
    if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
    oldBalance = currentUser.balance;
  }

  const user = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id },
      data: allowedFields,
      select: { id: true, name: true, email: true, role: true, balance: true, totalEarnings: true },
    });

    // Create a Transaction record for balance adjustments
    if (isBalanceChange) {
      const newBalance = parseFloat(body.balance);
      const adjustmentAmount = newBalance - oldBalance;

      if (adjustmentAmount !== 0) {
        await tx.transaction.create({
          data: {
            userId: id,
            type: "admin_adjustment",
            amount: adjustmentAmount,
            balanceBefore: oldBalance,
            balanceAfter: newBalance,
            description: `Admin balance adjustment by ${adminId || "unknown"}`,
            metadata: JSON.stringify({
              adminId,
              reason: body.reason || "Manual adjustment",
            }),
          },
        });
      }
    }

    return updated;
  });

  return NextResponse.json(user);
}
