import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  // select each wish that is not assigned yet
  const wishes = await prisma.wish.findMany({
    where: { assignedLockerId: null },
    orderBy: { createdAt: "asc" },
  });

  // get all free lockers
  const lockers = await prisma.locker.findMany({
    where: { wish: null },
    orderBy: [{ row: "asc" }, { col: "asc" }],
  });

  if (lockers.length < wishes.length) {
    return NextResponse.json(
      { error: "Nicht genug freie Schließfächer!" },
      { status: 400 }
    );
  }

  // TODO: better assignment algorithm, see: proof_of_concept.py
  // assign lockers to wishes
  for (let i = 0; i < wishes.length; i++) {
    await prisma.wish.update({
      where: { id: wishes[i].id },
      data: { assignedLockerId: lockers[i].id },
    });
  }

  return NextResponse.json({ success: true });
}
