import { NextResponse } from "next/server";
import { handleLockerRequest } from "@/lib/lockerService";

export async function POST(req: Request) {
    const body = await req.json();
    const result = await handleLockerRequest(body);
    return NextResponse.json(result.data, { status: result.status });
}