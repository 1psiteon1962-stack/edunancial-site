import { NextResponse, type NextRequest } from "next/server";

import { createCsrfToken, CSRF_COOKIE_NAME } from "@/lib/security/csrf";
import { buildSecurityHeaders } from "@/lib/security/headers";
import { canAccessAdminPath } from "@/lib/security/policies";
import { getSecuritySessionFromRequest } from "@/lib/security/session";

export async function middleware(request: NextRequest) {
  const response =
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
      ? await handleAdminAccess(request)
      : NextResponse.next();

  response.headers.set("x-request-id", request.headers.get("x-request-id") ?? crypto.randomUUID());

  for (const [key, value] of Object.entries(buildSecurityHeaders())) {
    response.headers.set(key, value);
  }

  if (!request.cookies.get(CSRF_COOKIE_NAME)?.value) {
    response.cookies.set(CSRF_COOKIE_NAME, createCsrfToken(), {
      httpOnly: false,
      maxAge: 60 * 60 * 8,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

async function handleAdminAccess(request: NextRequest) {
  const session = await getSecuritySessionFromRequest(request);

  if (!session.isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!canAccessAdminPath(session.role, request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
