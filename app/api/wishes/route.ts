import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const wishes = await prisma.wish.findMany({
    include: { assignedLocker: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(wishes);
}
