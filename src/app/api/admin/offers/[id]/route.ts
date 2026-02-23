import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { rewards: { orderBy: { sortOrder: "asc" } } },
    });

    if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(offer);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
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
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;

    await prisma.offer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
