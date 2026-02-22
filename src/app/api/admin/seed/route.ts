import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
import { offers as seedOffers } from "@/data/offers";

export async function POST() {
  // Create admin user if not exists
  const adminEmail = "admin@cashblitz.com";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password: await bcrypt.hash("admin123", 12),
        role: "admin",
        balance: 0,
      },
    });
  }

  // Create demo user
  const demoEmail = "demo@cashblitz.com";
  const existingDemo = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!existingDemo) {
    await prisma.user.create({
      data: {
        name: "Player",
        email: demoEmail,
        password: await bcrypt.hash("demo123", 12),
        role: "user",
        balance: 10.35,
        totalEarnings: 10.35,
      },
    });
  }

  // Seed offers
  const existingOffers = await prisma.offer.count();
  if (existingOffers === 0) {
    for (const offer of seedOffers) {
      await prisma.offer.create({
        data: {
          name: offer.name,
          image: offer.image,
          rating: offer.rating,
          platform: offer.platform,
          totalReward: offer.totalReward,
          category: offer.category,
          isPremium: offer.isPremium || false,
          isHot: offer.isHot || false,
          isNew: offer.isNew || false,
          isActive: true,
          description: offer.description,
          steps: JSON.stringify(offer.steps),
          newUsersOnly: offer.newUsersOnly,
          rewardMultiplier: offer.rewardMultiplier,
          rewards: {
            create: offer.rewards.map((r, i) => ({
              task: r.task,
              amount: r.amount,
              timeLimit: r.timeLimit || null,
              isBonus: r.isBonus || false,
              isLimited: r.isLimited || false,
              sortOrder: i,
            })),
          },
        },
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: "Seeded admin (admin@cashblitz.com / admin123), demo user (demo@cashblitz.com / demo123), and offers",
  });
}
