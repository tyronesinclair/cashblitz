import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const offers = await prisma.offer.findMany({
    where: { isActive: true },
    include: { rewards: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(offers);
}
