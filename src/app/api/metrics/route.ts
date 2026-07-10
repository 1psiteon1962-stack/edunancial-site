import { NextResponse } from "next/server";
import { renderPrometheusMetrics } from "@/lib/observability/metrics";
import { attachRequestHeaders, getRequestId } from "@/lib/observability/tracing";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = getRequestId(request.headers);
  const response = new NextResponse(renderPrometheusMetrics(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

  return attachRequestHeaders(response, requestId);
}
