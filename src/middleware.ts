import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { logger } from "@/lib/observability/logger";
import {
  CORRELATION_ID_HEADER,
  REQUEST_ID_HEADER,
  generateRequestId,
} from "@/lib/observability/tracing";
import { type SessionData, getSessionOptions } from "@/lib/auth/session";

// ============================================================
// Member-only routes that require an active server session
// ============================================================
const MEMBER_ROUTES = [
  "/dashboard",
  "/profile",
  "/my-courses",
  "/my-books",
  "/my-certificates",
  "/assessment/start",
  "/settings",
  "/account",
];

// API routes that require a session (return 401 instead of redirect)
const PROTECTED_API_PREFIXES = [
  "/api/auth/logout",
  "/api/auth/resend-verification",
];

function isProtectedMemberRoute(pathname: string): boolean {
  return MEMBER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

function isProtectedApiRoute(pathname: string): boolean {
  return PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const start = Date.now();
  const requestId =
    request.headers.get(REQUEST_ID_HEADER) ??
    request.headers.get(CORRELATION_ID_HEADER) ??
    generateRequestId();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(REQUEST_ID_HEADER, requestId);
  requestHeaders.set(CORRELATION_ID_HEADER, requestId);

  const pathname = request.nextUrl.pathname;

  // --------------------------------------------------------
  // Route protection
  // --------------------------------------------------------
  if (isProtectedMemberRoute(pathname) || isProtectedApiRoute(pathname)) {
    let isLoggedIn = false;

    try {
      // Read the session cookie without modifying it
      const tempResponse = NextResponse.next();
      const session = await getIronSession<SessionData>(request, tempResponse, getSessionOptions());
      isLoggedIn = session.isLoggedIn === true && !!session.memberId;
    } catch {
      // Session secret not configured or cookie invalid — treat as unauthenticated
      isLoggedIn = false;
    }

    if (!isLoggedIn) {
      if (isProtectedApiRoute(pathname)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // Redirect to login, preserving the requested path
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // --------------------------------------------------------
  // Request ID propagation
  // --------------------------------------------------------
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const durationMs = Date.now() - start;

  response.headers.set(REQUEST_ID_HEADER, requestId);
  response.headers.set(CORRELATION_ID_HEADER, requestId);

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
  matcher: [
    "/api/:path*",
    "/admin/kpi/export",
    "/dashboard/:path*",
    "/profile/:path*",
    "/my-courses/:path*",
    "/my-books/:path*",
    "/my-certificates/:path*",
    "/assessment/start/:path*",
    "/settings/:path*",
    "/account/:path*",
  ],
};
