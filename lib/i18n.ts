// lib/i18n.ts

export const supportedLanguages = ["en", "es"] as const;
export type Language = typeof supportedLanguages[number];

export const defaultLanguage: Language = "en";

/**
 * Defines which languages are valid per region.
 * This prevents invalid language routing at build time.
 */
export const REGION_LANGUAGES: Record<string, readonly Language[]> = {
  us: ["en", "es"],
  africa: ["en"],
  eu: ["en"],
  mena: ["en"],
  "asia-pacific": ["en"],
  "asia-emerging": ["en"],
};

/**
 * Resolves copy safely for region + language.
 * Falls back to English if the requested language is unsupported.
 */
export function resolveCopy<T extends Record<string, any>>(
  copyMap: Record<Language, T>,
  lang: Language
): T {
  return copyMap[lang] ?? copyMap.en;
}
