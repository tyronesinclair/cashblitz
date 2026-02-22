import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

async function isAdmin() {
  const session = await auth();
  return session?.user && (session.user as Record<string, unknown>).role === "admin";
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const offer = await prisma.offer.findUnique({
    where: { id },
    include: { rewards: { orderBy: { sortOrder: "asc" } } },
  });

  if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(offer);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const body = await req.json();
  const { rewards, ...offerData } = body;

  if (offerData.steps && Array.isArray(offerData.steps)) {
    offerData.steps = JSON.stringify(offerData.steps);
  }

  // Update offer fields
  const offer = await prisma.offer.update({
    where: { id },
    data: offerData,
  });

  // Replace rewards if provided
  if (rewards) {
    await prisma.reward.deleteMany({ where: { offerId: id } });
    await prisma.reward.createMany({
      data: rewards.map((r: Record<string, unknown>, i: number) => ({
        offerId: id,
        task: r.task as string,
        amount: r.amount as number,
        timeLimit: (r.timeLimit as string) || null,
        isBonus: (r.isBonus as boolean) || false,
        isLimited: (r.isLimited as boolean) || false,
        sortOrder: i,
      })),
    });
  }

  const updated = await prisma.offer.findUnique({
    where: { id },
    include: { rewards: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  await prisma.offer.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
