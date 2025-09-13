import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// Nur im Dev-Modus erlauben
if (process.env.NODE_ENV !== "development") {
  throw new Error("Dev login disabled in production");
}

export async function POST(req: Request) {
  // Fake-User-Daten
  const fakeUser = { email: "dev@fs.uni-frankfurt.de", name: "Dev User" };

  // Hier setzen wir direkt die Session via NextAuth
  const session = await getServerSession(authOptions);

  // Normalerweise muss man ein Session-Cookie setzen. In Next.js App Router
  // kann man den Response-Helper von NextAuth verwenden, oder für Dev einfach redirect
  return NextResponse.json({ ok: true, user: fakeUser });
}
