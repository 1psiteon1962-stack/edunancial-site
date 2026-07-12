import type { MetadataRoute } from "next";

import { APAC_LOCALES } from "@/config/asia-pacific";
import { LANGUAGE_CATALOG } from "@/lib/international/languages";

const SITE_URL = "https://www.edunancial.com";
const ACTIVE_LOCALE_CODES = new Set([
  "en",
  "es",
  "fr",
  "pt",
  "ar",
  "sw",
  "ja",
  "ko",
  "zh-Hans",
  "hi",
  "zh-Hant",
]);

const PATHS = [
  "",
  "/about",
  "/courses",
  "/membership",
  "/levels",
  "/sponsor",
  "/contact",
  "/privacy",
  "/trust-center",
  "/security",
  "/disclaimer",
  "/terms",
  "/refund-policy",
  "/faq",
  "/assessment",
  "/why-edunancial",
  "/canada",
  "/canada/courses",
  "/canada/membership",
  "/legal/pipeda",
  "/asia-pacific",
  ...APAC_LOCALES.map((locale) => `/asia-pacific/${locale}`),
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        LANGUAGE_CATALOG.filter((language) => ACTIVE_LOCALE_CODES.has(language.code)).map(
          (language) => [language.code, `${SITE_URL}/${language.code}${path}`]
        )
      ),
    },
  }));
}
