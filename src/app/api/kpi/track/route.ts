import { NextResponse } from "next/server";
import type { KPIEvent } from "@/lib/kpi/types";
import { writeEvent } from "@/lib/kpi/writeEvent";
import { hashIP } from "@/lib/kpi/hash";
import { getSiteContext } from "@/lib/kpi/site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: KPIEvent = await request.json();
    const context = getSiteContext(request);

    const ipHash = context.ip ? await hashIP(context.ip) : null;

    const row = {
      site_id: context.site_id,
      site_region: context.site_region,

      event_name: body.event_name,
      event_type: body.event_type ?? null,

      user_id: body.user_id ?? null,
      session_id: body.session_id ?? null,

      ip_hash: ipHash,
      user_agent: context.userAgent ?? null,

      path: body.path ?? context.path ?? null,
      referrer: body.referrer ?? context.referer ?? null,

      utm_source: body.utm_source ?? null,
      utm_medium: body.utm_medium ?? null,
      utm_campaign: body.utm_campaign ?? null,
      utm_term: body.utm_term ?? null,
      utm_content: body.utm_content ?? null,

      currency: body.currency ?? null,
      value: body.value ?? null,
      sku: body.sku ?? null,
      order_id: body.order_id ?? null,

      metadata: body.metadata ?? {},
    };

    await writeEvent(row);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("KPI TRACK ERROR:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
