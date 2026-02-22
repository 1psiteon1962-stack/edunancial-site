import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const user = process.env.ADMIN_BASIC_AUTH_USER;
  const pass = process.env.ADMIN_BASIC_AUTH_PASS;

  if (!user || !pass) {
    // Hard fail closed if admin credentials not set
    return unauthorized();
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  const base64 = auth.slice("Basic ".length).trim();
  let decoded = "";
  try {
    decoded = Buffer.from(base64, "base64").toString("utf8");
  } catch {
    return unauthorized();
  }

  const [u, p] = decoded.split(":");
  if (u !== user || p !== pass) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
