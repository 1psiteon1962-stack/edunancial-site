import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/observability/logger";
import {
  CORRELATION_ID_HEADER,
  REQUEST_ID_HEADER,
  generateRequestId,
} from "@/lib/observability/tracing";

export function middleware(request: NextRequest) {
  const start = Date.now();
  const requestId =
    request.headers.get(REQUEST_ID_HEADER) ??
    request.headers.get(CORRELATION_ID_HEADER) ??
    generateRequestId();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(REQUEST_ID_HEADER, requestId);
  requestHeaders.set(CORRELATION_ID_HEADER, requestId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const durationMs = Date.now() - start;

  response.headers.set(REQUEST_ID_HEADER, requestId);
  response.headers.set(CORRELATION_ID_HEADER, requestId);

  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/executive")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; img-src 'self' data: blob:; media-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    );
  }

  logger.info("request.completed", {
    requestId,
    method: request.method,
    path: request.nextUrl.pathname,
    statusCode: response.status,
    durationMs,
  });

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/executive/:path*"],
};
