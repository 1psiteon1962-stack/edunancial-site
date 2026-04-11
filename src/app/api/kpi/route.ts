import { NextResponse } from "next/server";
import type { KPIEvent } from "@/lib/kpi/types";
import { writeEvent as writeKPIEvent } from "@/lib/kpi/writeEvent";
import { hashIP } from "@/lib/kpi/hash";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: KPIEvent = await request.json();

    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "";

    const fingerprint = hashIP(ip);

    await writeKPIEvent({
      event_name: body.event_name,
      event_type: body.event_type, // ✅ now valid
      metadata: {
        ...(body.metadata || {}),
        fingerprint,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("KPI route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to write KPI event" },
      { status: 500 }
    );
  }
}
