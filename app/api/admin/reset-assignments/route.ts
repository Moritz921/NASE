import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  await prisma.wish.updateMany({
    data: { assignedLockerId: null },
  });
  return NextResponse.json({ success: true });
}
