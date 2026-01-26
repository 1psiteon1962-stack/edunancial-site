// app/api/signup/route.ts

import { NextRequest, NextResponse } from "next/server";
import { UserProfile } from "@/lib/types/user-profile";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const email = data.get("email")?.toString() || "";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const profile: UserProfile = {
      id: crypto.randomUUID(),
      email,
      createdAt: new Date().toISOString(),
      plan: "free",
      region: "us",
      language: "en",
    };

    return NextResponse.json({ success: true, profile });
  } catch {
    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}
