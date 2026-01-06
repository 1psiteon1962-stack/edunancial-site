// lib/i18n.ts

/* =========================
   Core Types
========================= */

export type Language = "en" | "es" | "fr" | "de" | "pt" | "ar";

export type Region =
  | "us"
  | "europe"
  | "mena"
  | "asia"
  | "apac"
  | "asia_emerging"
  | "latam"
  | "africa";

/* =========================
   Supported Languages
========================= */

export const supportedLanguages: Language[] = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "ar",
];

/* =========================
   Region → Languages
========================= */

export const REGION_LANGUAGES: Record<Region, ReadonlyArray<Language>> = {
  us: ["en", "es"],
  europe: ["en", "fr", "de"],
  mena: ["ar", "en"],
  asia: ["en"],
  apac: ["en"],
  asia_emerging: ["en"],
  latam: ["es", "pt"],
  africa: ["en", "fr", "ar"],
};

/* =========================
   Defaults
========================= */

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  europe: "en",
  mena: "ar",
  asia: "en",
  apac: "en",
  asia_emerging: "en",
  latam: "es",
  africa: "en",
};

/* =========================
   Guards & Helpers
========================= */

export function isLanguage(value: string): value is Language {
  return supportedLanguages.includes(value as Language);
}

/**
 * Translation helper
 * (language resolution happens upstream)
 */
export function t(key: string): string {
  return key;
}
