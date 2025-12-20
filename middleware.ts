import { NextRequest, NextResponse } from "next/server";

/**
 * REGION DEFINITIONS
 * Extend safely as we add Asia, LATAM, etc.
 */
const REGION_HOST_MAP: Record<string, string> = {
  "edunancial.com": "us",
  "www.edunancial.com": "us",

  "africa.edunancial.com": "africa",
  "latam.edunancial.com": "latam",
  "asia.edunancial.com": "asia",

  // staging / preview support
  "localhost": "us",
};

/**
 * COOKIE + QUERY KEYS
 */
const REGION_COOKIE = "edunancial_region";
const REGION_QUERY = "region";

/**
 * Middleware entry
 */
export function middleware(req: NextRequest) {
  const { nextUrl, headers, cookies } = req;
  const hostname = headers.get("host") || "";
  const url = nextUrl.clone();

  // 1️⃣ HOSTNAME-BASED REGION
  let region = REGION_HOST_MAP[hostname];

  // 2️⃣ QUERY STRING OVERRIDE
  if (!region && url.searchParams.has(REGION_QUERY)) {
    region = url.searchParams.get(REGION_QUERY) || undefined;
  }

  // 3️⃣ COOKIE FALLBACK
  if (!region) {
    region = cookies.get(REGION_COOKIE)?.value;
  }

  // 4️⃣ FINAL DEFAULT
  if (!region) {
    region = "us";
  }

  // 5️⃣ SET COOKIE (persist choice)
  const response = NextResponse.next();
  response.cookies.set(REGION_COOKIE, region, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });

  // 6️⃣ ATTACH HEADER (server-side access)
  response.headers.set("x-edunancial-region", region);

  return response;
}

/**
 * APPLY ONLY TO APP ROUTES
 */
export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
