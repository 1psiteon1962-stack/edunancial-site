import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const user = process.env.ADMIN_DASH_USER || "";
    const pass = process.env.ADMIN_DASH_PASS || "";

    if (!user || !pass) return NextResponse.next();

    const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
    const auth = req.headers.get("authorization") || "";

    if (auth !== expected) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Edunancial Admin"' },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
