import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { REGION_REGISTRY } from "@/lib/regions/regionRegistry";

function detectRegionFromHeaders(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country")?.toLowerCase();

  if (!country) return "us";

  // Map countries to your region buckets
  const latamCountries = ["mx", "co", "ar", "cl", "pe", "do", "pr"];
  const euCountries = ["de", "fr", "es", "it", "nl"];
  const africaCountries = ["gh", "ng", "ke", "za"];

  if (latamCountries.includes(country)) return "latam";
  if (euCountries.includes(country)) return "eu";
  if (africaCountries.includes(country)) return "africa";

  return "us";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip API + static
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && REGION_REGISTRY[segments[0]]) {
    return NextResponse.next();
  }

  const region = detectRegionFromHeaders(req);

  const url = req.nextUrl.clone();
  url.pathname = `/${region}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
