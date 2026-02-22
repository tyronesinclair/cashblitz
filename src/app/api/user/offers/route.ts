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
  const status = searchParams.get("status") || "all"; // all | active | completed | abandoned

  const where: Record<string, unknown> = { userId: session.user.id };
  if (status !== "all") {
    where.status = status;
  }

  const userOffers = await prisma.userOffer.findMany({
    where,
    include: {
      offer: {
        include: {
          rewards: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json(userOffers);
}
