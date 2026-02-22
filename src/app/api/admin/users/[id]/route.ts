import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAdmin } from "@/lib/auth";

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

  // Only allow updating certain fields
  const allowedFields: Record<string, unknown> = {};
  if (body.role !== undefined) allowedFields.role = body.role;
  if (body.balance !== undefined) allowedFields.balance = parseFloat(body.balance);
  if (body.totalEarnings !== undefined) allowedFields.totalEarnings = parseFloat(body.totalEarnings);
  if (body.level !== undefined) allowedFields.level = parseInt(body.level);
  if (body.streak !== undefined) allowedFields.streak = parseInt(body.streak);
  if (body.name !== undefined) allowedFields.name = body.name;

  const user = await prisma.user.update({
    where: { id },
    data: allowedFields,
    select: { id: true, name: true, email: true, role: true, balance: true, totalEarnings: true },
  });

  return NextResponse.json(user);
}
