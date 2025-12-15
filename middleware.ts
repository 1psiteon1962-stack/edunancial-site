import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // 🔒 STOP LOOP IF ALREADY RESOLVED
  if (request.headers.get("x-edunancial-resolved") === "1") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  // DEFAULTS
  let region = "us";
  let language = "en";

  // GEO
  const country = request.geo?.country?.toLowerCase() || "";

  if (["mx", "br", "ar", "co", "cl", "pe"].includes(country)) {
    region = "latam";
    language = "es";
  } else if (["fr", "de", "es", "it", "nl"].includes(country)) {
    region = "europe";
    language = "en";
  } else if (["jm", "do", "pr", "tt", "bs"].includes(country)) {
    region = "caribbean";
    language = "en";
  } else if (["ng", "ke", "za"].includes(country)) {
    region = "africa";
    language = "en";
  } else if (["jp", "kr", "sg", "in"].includes(country)) {
    region = "asia";
    language = "en";
  }

  // APPLY QUERY ONCE
  url.searchParams.set("region", region);
  url.searchParams.set("lang", language);

  // ✅ SINGLE REWRITE (THIS IS THE KEY)
  const res = NextResponse.rewrite(url);
  res.headers.set("x-edunancial-resolved", "1");

  return res;
}

/**
 * MATCHER — VERY IMPORTANT
 */
export const config = {
  matcher: ["/((?!_next|api|assets|favicon.ico).*)"],
};
