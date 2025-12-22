import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";

  // Only act on root path
  if (pathname !== "/") {
    return NextResponse.next();
  }

  // LATAM mirror → Spanish
  if (
    host.includes("latam") ||
    host.includes("mx") ||
    host.includes("ar") ||
    host.includes("co")
  ) {
    return NextResponse.redirect(new URL("/es", req.url));
  }

  // Default (US / global) → English
  return NextResponse.redirect(new URL("/en", req.url));
}

export const config = {
  matcher: ["/"],
};
