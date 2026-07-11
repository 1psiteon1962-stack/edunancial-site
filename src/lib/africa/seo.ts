// ======================================================
// AFRICA REGIONAL FOUNDATION
// seo.ts – SEO localization for Africa region pages
// Uses the shared createSEO helper from src/lib/seo.ts
// ======================================================

import type { Metadata } from "next";
import { createSEO } from "@/lib/seo";
import { AfricaLanguageCode } from "./languages";

export interface AfricaSEOConfig {
  countryIso: string;
  locale: string;
  /** hreflang alternates for this country page */
  hreflang: { lang: AfricaLanguageCode; href: string }[];
}

const BASE_URL = "https://www.edunancial.com";

/** Generate Next.js Metadata for the Africa region hub page. */
export function createAfricaRegionSEO(): Metadata {
  return createSEO(
    "Edunancial Africa – Financial Education for African Entrepreneurs",
    "Affordable financial education, business tools, and mentorship for entrepreneurs across Africa. Available in English, French, Arabic, and Portuguese.",
    "/africa"
  );
}

/** Generate Next.js Metadata for a specific African country page. */
export function createAfricaCountrySEO(
  countryName: string,
  isoCode: string,
  languageCode: AfricaLanguageCode
): Metadata {
  const slug = isoCode.toLowerCase();
  return createSEO(
    `Edunancial ${countryName} – Financial Education`,
    `Edunancial is coming to ${countryName}. Join the waitlist for early access to financial education tailored for ${countryName} entrepreneurs.`,
    `/africa/${slug}`
  );
}

/** Build hreflang link tags for a country page. */
export function buildAfricaHreflang(
  isoCode: string,
  availableLanguages: AfricaLanguageCode[]
): Record<string, string> {
  const slug = isoCode.toLowerCase();
  const tags: Record<string, string> = {};
  for (const lang of availableLanguages) {
    tags[`${lang}-${isoCode}`] = `${BASE_URL}/africa/${slug}?lang=${lang}`;
  }
  tags["x-default"] = `${BASE_URL}/africa/${slug}`;
  return tags;
}
