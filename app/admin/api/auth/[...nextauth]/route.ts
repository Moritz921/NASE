import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
