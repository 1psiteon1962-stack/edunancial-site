// lib/i18n.ts

/* ------------------ */
/* Languages */
/* ------------------ */

export type Language =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "ar";

/* ------------------ */
/* Regions (MUST match folder names) */
/* ------------------ */

export type Region =
  | "us"
  | "europe"
  | "mena"
  | "africa"
  | "asia"
  | "asia-pacific"
  | "asia-emerging";

/* ------------------ */
/* Global Supported Languages */
/* ------------------ */

export const supportedLanguages: readonly Language[] = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "ar",
];

/* ------------------ */
/* Region → Language Map */
/* ------------------ */

export const REGION_LANGUAGES: Record<Region, readonly Language[]> = {
  us: ["en", "es"],
  europe: ["en", "fr", "de", "es", "pt"],
  mena: ["ar", "en", "fr"],
  africa: ["en", "fr", "ar"],
  asia: ["en"],
  "asia-pacific": ["en"],
  "asia-emerging": ["en"],
};

/* ------------------ */
/* Language Guard */
/* ------------------ */

export function isLanguage(value: string): value is Language {
  return supportedLanguages.includes(value as Language);
}

/* ------------------ */
/* Minimal translation helper */
/* ------------------ */

export function t(key: string): string {
  return key;
}
