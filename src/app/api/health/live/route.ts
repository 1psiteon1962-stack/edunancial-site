import { NextResponse } from "next/server";
import { getLivenessPayload } from "@/lib/observability/health";
import { getRequestId, attachRequestHeaders } from "@/lib/observability/tracing";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = getRequestId(request.headers);
  const response = NextResponse.json({
    requestId,
    ...getLivenessPayload(),
  });

  return attachRequestHeaders(response, requestId);
}
