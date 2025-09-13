import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const wishes = await prisma.wish.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(wishes);
}
