import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/observability/logger";
import {
  CORRELATION_ID_HEADER,
  REQUEST_ID_HEADER,
  generateRequestId,
} from "@/lib/observability/tracing";

const ADMIN_SESSION_COOKIE = "edunancial_admin_session";

function base64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4 || 4)) % 4);

  try {
    return atob(padded);
  } catch {
    throw new Error("Invalid base64url");
  }
}

function getAdminSessionFromCookie(value: string | undefined): {
  valid: boolean;
  expired: boolean;
} {
  if (!value) {
    return { valid: false, expired: false };
  }

  const dotIdx = value.lastIndexOf(".");
  if (dotIdx < 0) {
    return { valid: false, expired: false };
  }

  const payload = value.slice(0, dotIdx);

  try {
    const json = JSON.parse(base64urlDecode(payload)) as {
      expiresAt?: number;
      email?: string;
      csrfToken?: string;
    };

    if (!json.email || !json.csrfToken || typeof json.expiresAt !== "number") {
      return { valid: false, expired: false };
    }

    if (json.expiresAt <= Date.now()) {
      return { valid: true, expired: true };
    }

    return { valid: true, expired: false };
  } catch {
    return { valid: false, expired: false };
  }
}

export function middleware(request: NextRequest) {
  const start = Date.now();
  const requestId =
    request.headers.get(REQUEST_ID_HEADER) ??
    request.headers.get(CORRELATION_ID_HEADER) ??
    generateRequestId();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(REQUEST_ID_HEADER, requestId);
  requestHeaders.set(CORRELATION_ID_HEADER, requestId);

  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin");
  const isExecutivePath = pathname.startsWith("/executive");
  const isCuPath = pathname === "/cu";
  const isCuApiPath = pathname.startsWith("/api/cu");
  const isAdminLoginPath = pathname === "/admin/login";
  const isAdminAuthApiPath = pathname.startsWith("/api/admin/auth/");

  let response =
    isAdminPath && !isAdminLoginPath && !isAdminAuthApiPath
      ? (() => {
          const session = getAdminSessionFromCookie(
            request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
          );

          if (!session.valid || session.expired) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
          }

          return NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
        })()
      : NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });

  const durationMs = Date.now() - start;

  response.headers.set(REQUEST_ID_HEADER, requestId);
  response.headers.set(CORRELATION_ID_HEADER, requestId);

  if (isAdminPath || isExecutivePath || isCuPath || isCuApiPath) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; img-src 'self' data: blob:; media-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    );
  }

  logger.info("request.completed", {
    requestId,
    method: request.method,
    path: pathname,
    statusCode: response.status,
    durationMs,
  });

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/executive/:path*", "/cu"],
};
