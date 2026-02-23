import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
    const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") || "20") || 20), 100);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const VALID_SORT_FIELDS = ["createdAt", "name", "email", "balance", "totalEarnings"];
    const rawSortBy = searchParams.get("sortBy") || "createdAt";
    const sortBy = VALID_SORT_FIELDS.includes(rawSortBy) ? rawSortBy : "createdAt";
    const rawSortOrder = searchParams.get("sortOrder") || "desc";
    const sortOrder = rawSortOrder === "asc" ? "asc" : "desc";

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          balance: true,
          totalEarnings: true,
          level: true,
          streak: true,
          createdAt: true,
          _count: { select: { userOffers: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ users, total, page, limit, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
