import type { MetadataRoute } from "next";

import { APAC_LOCALES } from "@/config/asia-pacific";
import { getCurriculumSitemapEntries } from "@/lib/curriculum/reader";

const SITE_URL = "https://edunancial.com";

const PATHS = [
  "", "/about", "/blog", "/courses", "/membership", "/levels", "/sponsor",
  "/contact", "/privacy", "/trust-center", "/security", "/disclaimer", "/terms",
  "/refund-policy", "/faq", "/assessment", "/africa", "/why-edunancial",
  "/canada", "/canada/courses", "/canada/membership", "/legal/pipeda",
  "/europe", "/western-europe", "/eastern-europe", "/asia-pacific",
  ...APAC_LOCALES.map((locale) => `/asia-pacific/${locale}`),
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  // Localized alternates are emitted only by routes that actually exist.
  // Do not advertise synthetic /<locale>/... URLs from the global sitemap.
  const curriculumEntries = getCurriculumSitemapEntries(SITE_URL);
  return [...staticEntries, ...curriculumEntries];
}
