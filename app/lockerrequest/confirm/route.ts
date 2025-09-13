import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json({ error: "Token missing" }, { status: 400 });
    }

    const wish = await prisma.wish.findUnique({
        where: { confirmToken: token }
    });
    
    if (!wish) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    
    if (wish.confirmed) {
        return NextResponse.json({ message: "Already confirmed" });
    }

    await prisma.wish.update({
        where: { id: wish.id },
        data: { confirmed: true }
    });

    return NextResponse.redirect(new URL("/lockerrequest/success", req.url));
}