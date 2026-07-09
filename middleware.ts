import { NextRequest, NextResponse } from "next/server";

import {
  ADMIN_ACCESS_COOKIE,
  hasValidAdminAccessToken,
  isAdminProtectionEnabled,
} from "@/lib/auth/require-admin";
import {
  applySecurityHeaders,
  noIndexHeaderValue,
} from "@/lib/securityHeaders";

const adminAccessPath = "/admin/access";

function isProtectedAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isSensitivePath(pathname: string): boolean {
  return (
    isProtectedAdminPath(pathname) ||
    pathname === "/dashboard" ||
    pathname.startsWith("/member/") ||
    pathname.startsWith("/api/")
  );
}

function applyHeaders(response: NextResponse, pathname: string): NextResponse {
  applySecurityHeaders(response.headers);

  if (isSensitivePath(pathname)) {
    response.headers.set("X-Robots-Tag", noIndexHeaderValue);
  }

  return response;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    isProtectedAdminPath(pathname) &&
    pathname !== adminAccessPath &&
    isAdminProtectionEnabled()
  ) {
    const accessToken = request.nextUrl.searchParams.get("access");
    const cookieToken = request.cookies.get(ADMIN_ACCESS_COOKIE)?.value;
    const headerToken = request.headers.get("x-admin-token");
    const validToken =
      accessToken ?? cookieToken ?? headerToken ?? undefined;

    if (hasValidAdminAccessToken(validToken)) {
      if (accessToken) {
        const cleanUrl = request.nextUrl.clone();
        cleanUrl.searchParams.delete("access");
        const response = applyHeaders(NextResponse.redirect(cleanUrl), pathname);
        response.cookies.set(ADMIN_ACCESS_COOKIE, accessToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
        return response;
      }

      return applyHeaders(NextResponse.next(), pathname);
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = adminAccessPath;
    loginUrl.searchParams.set("next", pathname);
    return applyHeaders(NextResponse.redirect(loginUrl), pathname);
  }

  return applyHeaders(NextResponse.next(), pathname);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
