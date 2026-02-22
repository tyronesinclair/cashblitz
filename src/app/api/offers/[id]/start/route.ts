import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: offerId } = await params;

  // Check if offer exists and is active
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    select: { id: true, name: true, isActive: true, externalUrl: true },
  });

  if (!offer || !offer.isActive) {
    return NextResponse.json({ error: "Offer not found or inactive" }, { status: 404 });
  }

  // Check if user already started this offer
  const existing = await prisma.userOffer.findUnique({
    where: {
      userId_offerId: {
        userId: session.user.id,
        offerId,
      },
    },
  });

  if (existing) {
    return NextResponse.json({
      message: "Offer already started",
      userOffer: existing,
      externalUrl: offer.externalUrl,
    });
  }

  // Create UserOffer record with unique tracking ID
  const trackingId = randomUUID();
  const userOffer = await prisma.userOffer.create({
    data: {
      userId: session.user.id,
      offerId,
      trackingId,
      status: "active",
    },
  });

  // Create a notification
  await prisma.notification.create({
    data: {
      userId: session.user.id,
      type: "system",
      title: "Offer Started!",
      message: `You started "${offer.name}". Complete tasks to earn rewards!`,
      metadata: JSON.stringify({ offerId, trackingId }),
    },
  });

  return NextResponse.json({
    message: "Offer started successfully",
    userOffer,
    externalUrl: offer.externalUrl,
    trackingId,
  }, { status: 201 });
}
