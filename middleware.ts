import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Identify region early (future use)
  const country =
    req.headers.get("x-nf-country") ||
    req.headers.get("cf-ipcountry") ||
    "UNKNOWN";

  // Attach for future analytics / routing
  res.headers.set("x-edunancial-region", country);

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
