import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/kpi/supabaseAdmin";
import { getSiteContext } from "@/lib/kpi/site";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      event_type,
      region,
      fingerprint,
      metadata,
    } = body;

    // ✅ STEP 1: resolve promise explicitly
    const sitePromise = getSiteContext(request);

    // ✅ STEP 2: force await (no TS ambiguity)
    const siteResolved = await sitePromise;

    // ✅ STEP 3: extract values AFTER resolution
    const siteRegion =
      typeof siteResolved?.region === "string"
        ? siteResolved.region
        : "US";

    const siteClientId =
      siteResolved?.client_id ?? null;

    // ✅ STEP 4: final safe values
    const finalRegion =
      typeof region === "string" && region.length > 0
        ? region
        : siteRegion;

    const { error } = await supabaseAdmin
      .from("kpi_events")
      .insert([
        {
          event_type,
          region: finalRegion,
          fingerprint: fingerprint ?? null,
          metadata: metadata ?? {},
          client_id: siteClientId,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error("KPI insert error:", error);
      return NextResponse.json(
        { success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("KPI route error:", err);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
