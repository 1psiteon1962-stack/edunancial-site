import type { MetadataRoute } from "next";

import { languages } from "@/lib/i18n/languages";
import { generateMultilingualSitemapEntries } from "@/lib/i18n/sitemap-helpers";

const pages = [
  "",
  "about",
  "courses",
  "membership",
  "levels",
  "sponsor",
  "contact",
  "privacy",
  "trust-center",
  "security",
  "disclaimer",
  "terms",
  "refund-policy",
  "faq",
  "assessment",
  "why-edunancial",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    generateMultilingualSitemapEntries(page, [...languages])
  );
}
