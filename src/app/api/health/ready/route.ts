import { NextResponse } from "next/server";
import { getReadinessPayload } from "@/lib/observability/health";
import { getRequestId, attachRequestHeaders } from "@/lib/observability/tracing";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = getRequestId(request.headers);
  const readiness = getReadinessPayload();

  const response = NextResponse.json(
    {
      requestId,
      ...readiness,
    },
    { status: readiness.ready ? 200 : 503 }
  );

  return attachRequestHeaders(response, requestId);
}
