import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Africa mirror hard guard
  if (pathname === "/africa") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/africa/:path*"],
};
