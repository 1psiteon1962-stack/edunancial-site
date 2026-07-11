import type { NextRequest } from "next/server";

export function getClientIp(request: Request | NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function getJsonError(message: string, status: number) {
  return Response.json({ success: false, error: message }, { status });
}
