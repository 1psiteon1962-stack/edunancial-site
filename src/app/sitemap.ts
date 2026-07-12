import type { MetadataRoute } from "next";

import { LANGUAGE_CATALOG } from "@/lib/international/languages";

const SITE_URL = "https://www.edunancial.com";
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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const languageAlternates = Object.fromEntries(
    LANGUAGE_CATALOG.map((language) => [language.code, `${SITE_URL}/?lang=${language.code}`])
  );

  return PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    alternates: {
      languages: languageAlternates,
    },
  }));
}

