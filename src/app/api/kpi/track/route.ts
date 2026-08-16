import { NextResponse } from "next/server";

import { hashIP } from "@/lib/kpi/hash";
import { getSiteContext } from "@/lib/kpi/site";
import type { KPIEventName } from "@/lib/kpi/types";
import { logStructuredError } from "@/lib/observability/errors";
import { logger } from "@/lib/observability/logger";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const ALLOWED_EVENTS = new Set<KPIEventName>([
  "page_view",
  "click",
  "signup",
  "login",
  "purchase",
]);

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const rawName = String(body.event_name ?? body.event ?? "");

    if (!ALLOWED_EVENTS.has(rawName as KPIEventName)) {
      return attachRequestHeaders(
        NextResponse.json({ success: false, error: "Invalid KPI event", requestId }, { status: 400 }),
        requestId
      );
    }

    const context = getSiteContext(request);
    const metadata =
      body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
        ? (body.metadata as Record<string, unknown>)
        : {};
    const path = String(body.path ?? metadata.path ?? context.path ?? "").slice(0, 2048) || null;
    const ipHash = context.ip ? await hashIP(context.ip.split(",")[0].trim()) : null;

    const row = {
      site_id: context.site_id,
      site_region: context.site_region,
      event_name: rawName,
      user_id: typeof body.user_id === "string" ? body.user_id : null,
      session_id: typeof body.session_id === "string" ? body.session_id : null,
      ip_hash: ipHash,
      user_agent: context.userAgent,
      path,
      referrer: typeof body.referrer === "string" ? body.referrer : context.referer,
      utm_source: typeof body.utm_source === "string" ? body.utm_source : null,
      utm_medium: typeof body.utm_medium === "string" ? body.utm_medium : null,
      utm_campaign: typeof body.utm_campaign === "string" ? body.utm_campaign : null,
      utm_term: typeof body.utm_term === "string" ? body.utm_term : null,
      utm_content: typeof body.utm_content === "string" ? body.utm_content : null,
      currency: typeof body.currency === "string" ? body.currency : null,
      value: typeof body.value === "number" && Number.isFinite(body.value) ? body.value : null,
      sku: typeof body.sku === "string" ? body.sku : null,
      order_id: typeof body.order_id === "string" ? body.order_id : null,
      metadata,
    };

    const { error } = await getSupabaseAdminClient().from("kpi_events").insert(row);
    if (error) throw error;

    logger.info("kpi.track.persisted", { requestId, eventName: rawName });
    const response = NextResponse.json({ success: true, requestId });
    recordRequestMetric({ method: request.method, route: "/api/kpi/track", status: 200, durationMs: Date.now() - start });
    return attachRequestHeaders(response, requestId);
  } catch (error) {
    logStructuredError(error, { ...getRequestContext(request, requestId), route: "/api/kpi/track" });
    const response = NextResponse.json(
      { success: false, error: "KPI tracking failed", requestId },
      { status: 500 }
    );
    recordRequestMetric({ method: request.method, route: "/api/kpi/track", status: 500, durationMs: Date.now() - start });
    return attachRequestHeaders(response, requestId);
  }
}
