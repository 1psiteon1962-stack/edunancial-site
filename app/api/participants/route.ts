// app/api/participants/route.ts

import { NextResponse } from "next/server";
import type { ParticipantProfile } from "../../../lib/db/schema";

export async function POST(req: Request) {
  const data = (await req.json()) as Partial<ParticipantProfile>;

  const participant: ParticipantProfile = {
    id: data.id ?? crypto.randomUUID(),
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    email: data.email ?? "",
    region: data.region ?? "unknown",
    language: data.language ?? "en",
    createdAt: new Date().toISOString()
  };

  return NextResponse.json({
    ok: true,
    participant
  });
}
