import { NextResponse } from "next/server";
import { getLivenessPayload, getReadinessPayload } from "@/lib/observability/health";
import { getRequestId, attachRequestHeaders } from "@/lib/observability/tracing";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = getRequestId(request.headers);
  const liveness = getLivenessPayload();
  const readiness = getReadinessPayload();

  const response = NextResponse.json({
    status: readiness.ready ? "ok" : "degraded",
    requestId,
    liveness,
    readiness,
  });

  return attachRequestHeaders(response, requestId);
}
