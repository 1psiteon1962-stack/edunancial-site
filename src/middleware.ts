import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const supportedLanguages = [
  "en",
  "es",
  "ko",
  "ja",
  "tl",
  "ar",
  "pt",
  "fr"
];

function detectLanguage(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language");

  if (!acceptLang) return "en";

  const preferred = acceptLang
    .split(",")
    .map((lang) => lang.split(";")[0].trim().toLowerCase());

  for (const lang of preferred) {
    const short = lang.split("-")[0];
    if (supportedLanguages.includes(short)) {
      return short;
    }
  }

  return "en";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split("/").filter(Boolean);

  // Only apply to /us (or region root without lang)
  if (segments.length === 1 && segments[0] === "us") {
    const detectedLang = detectLanguage(request);

    const url = request.nextUrl.clone();
    url.pathname = `/us/${detectedLang}`;

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/us"]
};
