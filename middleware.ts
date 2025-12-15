import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // ✅ NETLIFY-SAFE LOOP GUARD (query params persist; headers often do not)
  if (url.searchParams.get("_ed_resolved") === "1") {
    return NextResponse.next();
  }

  // Defaults
  let region = "us";
  let language = "en";

  // Geo can be undefined in some environments; keep it safe
  const country = (request.geo?.country || "").toLowerCase();

  // Region resolution (adjust anytime later; this won’t break)
  if (["pr", "do", "jm", "tt", "bs", "bb"].includes(country)) {
    region = "caribbean";
    language = "en";
  } else if (["mx", "br", "ar", "co", "cl", "pe", "ec", "uy", "py", "bo", "gt", "sv", "hn", "ni", "cr", "pa"].includes(country)) {
    region = "latam";
    language = "es";
  } else if (["fr", "de", "es", "it", "nl", "pt", "be", "ie", "at", "ch", "se", "no", "dk", "fi"].includes(country)) {
    region = "europe";
    language = "en";
  } else if (["ng", "ke", "za", "gh", "tz", "ug", "rw", "sn", "ci", "cm"].includes(country)) {
    region = "africa";
    language = "en";
  } else if (["jp", "kr", "sg", "in", "ph", "th", "vn", "my", "id", "hk", "tw"].includes(country)) {
    region = "asia";
    language = "en";
  }

  // Apply once
  url.searchParams.set("region", region);
  url.searchParams.set("lang", language);

  // ✅ This is the “do not loop” switch
  url.searchParams.set("_ed_resolved", "1");

  return NextResponse.rewrite(url);
}

// ✅ EXCLUDE: next internals, api routes, static assets, common files
export const config = {
  matcher: [
    "/((?!_next|api|assets|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|json)$).*)",
  ],
};
