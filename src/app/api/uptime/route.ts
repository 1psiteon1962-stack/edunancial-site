import { NextResponse } from "next/server";
import { getRequestId, attachRequestHeaders } from "@/lib/observability/tracing";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = getRequestId(request.headers);

  const response = NextResponse.json({
    ok: true,
    requestId,
    timestamp: new Date().toISOString(),
  });

  return attachRequestHeaders(response, requestId);
}
