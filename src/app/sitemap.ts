import type { MetadataRoute } from "next";

import { APAC_LOCALES } from "@/config/asia-pacific";
import { LANGUAGE_CATALOG } from "@/lib/international/languages";

const SITE_URL = "https://www.edunancial.com";
const ACTIVE_LOCALE_CODES = new Set([
  "en",
  "es",
  "fr",
  "pt",
  "de",
  "it",
  "nl",
  "ht",
  "pap",
  "pl",
  "cs",
  "sk",
  "ro",
  "bg",
  "lt",
  "lv",
  "et",
  "ru",
  "be",
  "ar",
  "he",
  "fa",
  "prs",
  "ps",
  "hi",
  "ur",
  "bn",
  "ta",
  "sw",
  "lg",
  "yo",
  "ig",
  "ha",
  "zu",
  "am",
  "ja",
  "ko",
  "zh-Hans",
  "zh-Hant",
  "th",
  "vi",
  "ms",
  "id",
  "fil",
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

import { getCurriculumSitemapEntries } from "@/lib/curriculum/reader";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = PATHS.map((path) => ({
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

  // Curriculum entries are auto-generated from the registry — no code change needed when new lessons are added
  const curriculumEntries = getCurriculumSitemapEntries(SITE_URL);

  return [...staticEntries, ...curriculumEntries];
}
