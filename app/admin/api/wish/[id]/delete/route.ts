import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: { params: { id: string } }) {
  // await context.params ist nötig
  const { id } = await context.params;
  const wishId = Number(id);

  await prisma.wish.delete({ where: { id: wishId } });
  return NextResponse.json({ ok: true });
}
