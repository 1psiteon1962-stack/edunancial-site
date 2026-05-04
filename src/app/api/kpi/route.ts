// src/app/api/kpi/route.ts

import { NextResponse } from "next/server";
import { writeKPIEvent } from "@/lib/kpi/writeKPIEvent";

type KPIRequestBody = {
  event_name?: string;
  event_type?: string | null;
  metadata?: Record<string, unknown>;
};

function createFingerprint(request: Request): string {
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "unknown";

  return `${userAgent}:${forwardedFor}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as KPIRequestBody;

    if (!body.event_name) {
      return NextResponse.json(
        { success: false, error: "Missing event_name" },
        { status: 400 }
      );
    }

    const fingerprint = createFingerprint(request);

    await writeKPIEvent({
      event_name: body.event_name,
      event_type: body.event_type ?? undefined,
      metadata: {
        ...(body.metadata ?? {}),
        fingerprint,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn("KPI route failed:", error);

    return NextResponse.json(
      { success: false, error: "KPI route failed" },
      { status: 500 }
    );
  }
}
