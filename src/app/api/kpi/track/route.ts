import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/kpi/supabaseAdmin";
import { getSiteContext } from "@/lib/kpi/site";

type SiteContext = {
  region?: string;
  client_id?: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      event_type,
      region,
      fingerprint,
      metadata,
    } = body;

    // ✅ FORCE RESOLUTION — NO PROMISE LEAK
    const site: SiteContext = await getSiteContext(request);

    // ✅ SAFE FALLBACKS (NO TYPE ERRORS)
    const resolvedRegion =
      typeof region === "string" && region.length > 0
        ? region
        : site.region || "US";

    const resolvedClientId =
      site.client_id ?? null;

    const { error } = await supabaseAdmin
      .from("kpi_events")
      .insert([
        {
          event_type,
          region: resolvedRegion,
          fingerprint: fingerprint ?? null,
          metadata: metadata ?? {},
          client_id: resolvedClientId,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error("KPI insert error:", error);
      return NextResponse.json(
        { success: false, error: "Insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("KPI route error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
