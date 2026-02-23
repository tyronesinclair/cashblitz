import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const SETTINGS_KEYS = ["siteName", "minWithdrawal", "referralBonus"];

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const configs = await prisma.appConfig.findMany({
    where: { key: { in: SETTINGS_KEYS } },
  });

  const result: Record<string, string> = {};
  for (const config of configs) {
    result[config.key] = config.value;
  }

  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  const updates: Promise<unknown>[] = [];
  for (const key of SETTINGS_KEYS) {
    if (body[key] !== undefined) {
      updates.push(
        prisma.appConfig.upsert({
          where: { key },
          update: { value: String(body[key]) },
          create: { key, value: String(body[key]) },
        })
      );
    }
  }

  await Promise.all(updates);

  return NextResponse.json({ success: true });
}
