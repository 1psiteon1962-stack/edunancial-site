import type { MetadataRoute } from "next";

import { APAC_LOCALES } from "@/config/asia-pacific";
import { resolveSeoAlternates } from "@/lib/international/global-regional-architecture";

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
  "/africa",
  "/why-edunancial",
  "/canada",
  "/canada/courses",
  "/canada/membership",
  "/legal/pipeda",
  "/europe",
  "/western-europe",
  "/eastern-europe",
  "/asia-pacific",
  ...APAC_LOCALES.map((locale) => `/asia-pacific/${locale}`),
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    alternates: path === "" ? { languages: resolveSeoAlternates({ canonicalPath: "/" }) } : undefined,
  }));
}
