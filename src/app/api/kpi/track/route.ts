import { NextResponse } from "next/server";

import { hashIP } from "@/lib/kpi/hash";
import { getAuthenticatedSupabaseUser } from "@/lib/auth/server";
import { detectTrustedRequestCountry } from "@/lib/location/request-country";
import { getSiteContext } from "@/lib/kpi/site";
import type { KPIEventName } from "@/lib/kpi/types";
import { logStructuredError } from "@/lib/observability/errors";
import { logger } from "@/lib/observability/logger";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";
import { insertKpiEvent } from "@/lib/kpi/repository";

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
    // Identity is established by the server session, never by user-submitted JSON.
    const authenticatedUser = await getAuthenticatedSupabaseUser();
    const metadata =
      body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
        ? (body.metadata as Record<string, unknown>)
        : {};
    // Never accept a browser-supplied visitor country as analytics evidence.
    // Netlify geolocation is read from the request on the server.
    const detectedCountry = detectTrustedRequestCountry(request.headers);
    const safeMetadata = { ...metadata };
    delete safeMetadata.visitor_country_code;
    delete safeMetadata.visitor_country_source;
    if (detectedCountry) {
      safeMetadata.visitor_country_code = detectedCountry.countryCode;
      safeMetadata.visitor_country_source = detectedCountry.source;
    }
    const path = String(body.path ?? metadata.path ?? context.path ?? "").slice(0, 2048) || null;
    const ipHash = context.ip ? await hashIP(context.ip.split(",")[0].trim()) : null;

    const row = {
      site_id: context.site_id,
      site_region: context.site_region,
      event_name: rawName,
      user_id: authenticatedUser?.id ?? null,
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
      metadata: safeMetadata,
    };

    const outcome = await insertKpiEvent(row);
    // 202 when the event was durably spooled for replay instead of written to a database.
    const queued = outcome.stored === "spool";
    const status = queued ? 202 : 200;

    logger.info("kpi.track.persisted", { requestId, eventName: rawName, store: outcome.stored });
    const response = NextResponse.json(queued ? { success: true, queued: true, requestId } : { success: true, requestId }, { status });
    recordRequestMetric({ method: request.method, route: "/api/kpi/track", status, durationMs: Date.now() - start });
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
