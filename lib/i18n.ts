// lib/i18n.ts

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

export const supportedLanguages: Language[] = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "ar",
];

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

/**
 * Simple translation helper.
 * Language resolution happens upstream.
 */
export function t(key: string): string {
  return key;
}
