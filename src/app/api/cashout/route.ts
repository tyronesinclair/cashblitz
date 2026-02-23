import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const VALID_METHODS = ["interac", "paypal", "visa", "amazon", "crypto", "apple", "steam"];
const MIN_AMOUNTS: Record<string, number> = {
  interac: 5,
  paypal: 5,
  visa: 10,
  amazon: 5,
  crypto: 10,
  apple: 10,
  steam: 5,
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, method, paymentDetails } = body;

    // Validate method
    if (!method || !VALID_METHODS.includes(method)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const minAmount = MIN_AMOUNTS[method] || 5;
    if (parsedAmount < minAmount) {
      return NextResponse.json(
        { error: `Minimum withdrawal for ${method} is C$${minAmount}` },
        { status: 400 }
      );
    }

    // Use a transaction to atomically check balance, deduct, and create payout record
    const [payout, transaction] = await prisma.$transaction(async (tx) => {
      // Check user balance inside transaction to prevent race conditions
      const user = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { balance: true },
      });

      if (!user || user.balance < parsedAmount) {
        throw new Error("Insufficient balance");
      }

      // Deduct balance
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: { balance: { decrement: parsedAmount } },
        select: { balance: true },
      });

      // Create payout record
      const payout = await tx.payout.create({
        data: {
          userId: session.user.id,
          amount: parsedAmount,
          method,
          status: "pending",
          paymentDetails: paymentDetails ? JSON.stringify(paymentDetails) : null,
        },
      });

      // Create transaction log
      const transaction = await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: "withdraw",
          amount: -parsedAmount,
          balanceBefore: user.balance,
          balanceAfter: updatedUser.balance,
          description: `Withdrawal of C$${parsedAmount.toFixed(2)} via ${method}`,
          metadata: JSON.stringify({ payoutId: payout.id, method }),
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: session.user.id,
          type: "cashout",
          title: "Withdrawal Requested",
          message: `Your withdrawal of CAD ${parsedAmount.toFixed(2)} via ${method} is being processed.`,
          metadata: JSON.stringify({ payoutId: payout.id }),
        },
      });

      return [payout, transaction];
    });

    return NextResponse.json({
      message: "Withdrawal request submitted successfully",
      payout: {
        id: payout.id,
        amount: payout.amount,
        method: payout.method,
        status: payout.status,
        createdAt: payout.createdAt,
      },
      transactionId: transaction.id,
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    if (message === "Insufficient balance") {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET: List user's payout history
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payouts = await prisma.payout.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(payouts);
}
