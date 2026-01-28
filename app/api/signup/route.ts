import { NextResponse } from "next/server";
import type { UserProfile } from "@/app/types/user";

export async function POST(req: Request) {
  const { email } = await req.json();

  const profile: UserProfile = {
    id: crypto.randomUUID(),
    email,
    createdAt: new Date().toISOString(),
    plan: "free",
  };

  return NextResponse.json({ ok: true, profile });
}
