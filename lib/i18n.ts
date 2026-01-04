// lib/i18n.ts

export type Language = "en" | "es" | "fr" | "de" | "pt" | "ar";
export type Region = "africa" | "eu" | "us" | "mena" | "asia";

export const REGION_LANGUAGES: Record<Region, readonly Language[]> = {
  africa: ["en", "fr", "ar"],
  eu: ["en", "fr", "de", "es", "pt"],
  us: ["en", "es"],
  mena: ["ar", "en", "fr"],
  asia: ["en"],
};

export function isLanguage(value: string): value is Language {
  return ["en", "es", "fr", "de", "pt", "ar"].includes(value);
}

/**
 * Minimal translation helper so imports don't explode.
 * You can replace logic later — this is intentionally simple.
 */
export function t(key: string): string {
  return key;
}
