import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/kpi/supabaseAdmin";
import { getSiteContext } from "@/lib/kpi/site";
import { sha256 } from "@/lib/kpi/hash";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const site = getSiteContext();

    const userAgent = req.headers.get("user-agent") || "";
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const fingerprint = await sha256(`${ip}-${userAgent}`);

    const { event_type, region, metadata } = body;

    if (!event_type) {
      return NextResponse.json(
        { error: "Missing event_type" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("kpi_events").insert([
      {
        event_type,
        region: region || site.region || "us",
        fingerprint,
        metadata: metadata || {},
      },
    ]);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
