import { NextResponse } from "next/server";
import { logStructuredError } from "@/lib/observability/errors";
import { logger } from "@/lib/observability/logger";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";

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

async function writeKPIEvent(event: {
  event_name: string;
  event_type?: string;
  metadata?: Record<string, unknown>;
  requestId: string;
}): Promise<void> {
  logger.info("kpi.event.received", {
    event_name: event.event_name,
    event_type: event.event_type,
    metadata: event.metadata,
    requestId: event.requestId,
  });
}

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);

  try {
    const body = (await request.json()) as KPIRequestBody;

    if (!body.event_name) {
      const response = NextResponse.json(
        { success: false, error: "Missing event_name", requestId },
        { status: 400 }
      );

      recordRequestMetric({
        method: request.method,
        route: "/api/kpi",
        status: 400,
        durationMs: Date.now() - start,
      });

      return attachRequestHeaders(response, requestId);
    }

    const fingerprint = createFingerprint(request);

    await writeKPIEvent({
      event_name: body.event_name,
      event_type: body.event_type ?? undefined,
      metadata: {
        ...(body.metadata ?? {}),
        fingerprint,
      },
      requestId,
    });

    const response = NextResponse.json({ success: true, requestId });

    recordRequestMetric({
      method: request.method,
      route: "/api/kpi",
      status: 200,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  } catch (error) {
    logStructuredError(error, {
      ...getRequestContext(request, requestId),
      route: "/api/kpi",
    });

    const response = NextResponse.json(
      { success: false, error: "KPI route failed", requestId },
      { status: 500 }
    );

    recordRequestMetric({
      method: request.method,
      route: "/api/kpi",
      status: 500,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  }
}
