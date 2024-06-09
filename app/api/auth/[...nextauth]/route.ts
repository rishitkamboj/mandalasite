import { authOptions } from "@/app/data/auth";
import NextAuth from "next-auth/next";


const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
