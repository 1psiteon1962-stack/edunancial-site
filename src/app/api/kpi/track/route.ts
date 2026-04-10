import { NextResponse } from "next/server";
import { getSiteContext } from "@/lib/kpi/site";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      event_type,
      region,
      fingerprint,
      metadata,
    }: {
      event_type: string;
      region?: string;
      fingerprint?: string;
      metadata?: Record<string, unknown>;
    } = body;

    const site = await getSiteContext(request);

    const payload = {
      event_type,
      region: region || site.region || "unknown",
      fingerprint: fingerprint || null,
      metadata: metadata || {},
    };

    return NextResponse.json({ success: true, payload });
  } catch (error) {
    console.error("KPI TRACK ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
