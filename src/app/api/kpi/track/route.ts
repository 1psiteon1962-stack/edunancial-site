import { NextResponse } from "next/server";
import { logStructuredError } from "@/lib/observability/errors";
import { logger } from "@/lib/observability/logger";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);

  try {
    const body = await request.json();

    logger.info("kpi.track.received", {
      requestId,
      payload: body,
    });

    const response = NextResponse.json({ success: true, requestId });

    recordRequestMetric({
      method: request.method,
      route: "/api/kpi/track",
      status: 200,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  } catch (error) {
    logStructuredError(error, {
      ...getRequestContext(request, requestId),
      route: "/api/kpi/track",
    });

    const response = NextResponse.json(
      { success: false, error: "KPI tracking failed", requestId },
      { status: 500 }
    );

    recordRequestMetric({
      method: request.method,
      route: "/api/kpi/track",
      status: 500,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  }
}
