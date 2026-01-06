// lib/i18n.ts

/* =========================
   LANGUAGES
========================= */

export const SUPPORTED_LANGUAGES = ["en", "es", "fr", "ar", "pt"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/* =========================
   REGIONS
========================= */

export const REGIONS = [
  "us",
  "latam",
  "caribbean",
  "europe",
  "africa",
  "mena",
  "asia",
  "asia-pacific",
  "asia-emerging",
] as const;

export type Region = (typeof REGIONS)[number];

/* =========================
   REGION → LANGUAGES
========================= */

export const REGION_LANGUAGES: Record<Region, readonly Language[]> = {
  us: ["en", "es"],
  latam: ["es"],
  caribbean: ["en", "es", "fr"],
  europe: ["en", "fr"],
  africa: ["en", "fr", "ar"],
  mena: ["ar", "en", "fr"],
  asia: ["en"],
  "asia-pacific": ["en"],
  "asia-emerging": ["en"],
} as const;

/* =========================
   DEFAULT LANGUAGE
========================= */

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  latam: "es",
  caribbean: "en",
  europe: "en",
  africa: "en",
  mena: "ar",
  asia: "en",
  "asia-pacific": "en",
  "asia-emerging": "en",
};

/* =========================
   TYPE GUARDS
========================= */

export function isLanguage(
  value: string,
  region: Region
): value is Language {
  return REGION_LANGUAGES[region].includes(value as Language);
}
