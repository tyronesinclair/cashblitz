import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

async function isAdmin() {
  const session = await auth();
  return session?.user && (session.user as Record<string, unknown>).role === "admin";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const offers = await prisma.offer.findMany({
    include: { rewards: { orderBy: { sortOrder: "asc" } }, _count: { select: { userOffers: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(offers);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { rewards, ...offerData } = body;

  const offer = await prisma.offer.create({
    data: {
      ...offerData,
      steps: JSON.stringify(offerData.steps || []),
      rewards: {
        create: (rewards || []).map((r: Record<string, unknown>, i: number) => ({
          task: r.task,
          amount: r.amount,
          timeLimit: r.timeLimit || null,
          isBonus: r.isBonus || false,
          isLimited: r.isLimited || false,
          sortOrder: i,
        })),
      },
    },
    include: { rewards: true },
  });

  return NextResponse.json(offer, { status: 201 });
}
