// lib/i18n.ts

/**
 * Supported languages (single source of truth)
 */
export const LANGUAGES = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "it",
  "ar",
  "hi",
  "zh",
] as const;

export type Language = (typeof LANGUAGES)[number];

/**
 * Language type guard
 */
export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && LANGUAGES.includes(value as Language);
}

/**
 * Default language per region
 * THIS defines valid regions
 */
export const DEFAULT_LANGUAGE_BY_REGION = {
  us: "en",
  pr: "es",
  latam: "es",
  eu: "en",
  africa: "en",
  asia: "en",
  middleeast: "ar",
  mena: "ar",
} as const;

/**
 * Region type
 */
export type Region = keyof typeof DEFAULT_LANGUAGE_BY_REGION;

/**
 * Normalize language safely
 */
export function normalizeLanguage(
  lang: unknown,
  fallback: Language = "en"
): Language {
  if (isLanguage(lang)) return lang;
  return fallback;
}

/**
 * Get default language for region
 */
export function getDefaultLanguage(region: Region): Language {
  return DEFAULT_LANGUAGE_BY_REGION[region];
}
