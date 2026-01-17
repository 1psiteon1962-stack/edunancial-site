import { NextResponse } from "next/server";
import type { ParticipantProfile } from "@/lib/db/schema";

export async function POST(req: Request) {
  const data = (await req.json()) as ParticipantProfile;

  // TODO: Replace with real persistence layer (Supabase, Postgres, etc.)
  console.log("New participant intake:", data);

  return NextResponse.json({ success: true });
}
