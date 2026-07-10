import { NextResponse } from "next/server";
import { logStructuredError } from "@/lib/observability/errors";
import { recordRequestMetric } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestContext, getRequestId } from "@/lib/observability/tracing";

export async function POST(request: Request) {
  const start = Date.now();
  const requestId = getRequestId(request.headers);

  try {
    const body = (await request.json()) as { id?: string };

    const response = NextResponse.json({
      success: true,
      checkoutUrl: `/checkout?product=${body.id ?? ""}`,
      requestId,
    });

    recordRequestMetric({
      method: request.method,
      route: "/api/square/checkout",
      status: 200,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  } catch (error) {
    logStructuredError(error, {
      ...getRequestContext(request, requestId),
      route: "/api/square/checkout",
    });

    const response = NextResponse.json(
      { success: false, error: "Checkout request failed", requestId },
      { status: 500 }
    );

    recordRequestMetric({
      method: request.method,
      route: "/api/square/checkout",
      status: 500,
      durationMs: Date.now() - start,
    });

    return attachRequestHeaders(response, requestId);
  }
}
