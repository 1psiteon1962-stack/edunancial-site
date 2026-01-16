// lib/i18n.ts

/**
 * Supported languages
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
 * Regions and default languages
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

export type Region = keyof typeof DEFAULT_LANGUAGE_BY_REGION;

/**
 * REGION → SUPPORTED LANGUAGES
 * REQUIRED by lib/static-param.ts
 */
export const REGION_LANGUAGES: Record<Region, readonly Language[]> = {
  us: ["en", "es"],
  pr: ["es", "en"],
  latam: ["es"],
  eu: ["en", "fr", "de", "it", "pt"],
  africa: ["en", "fr"],
  asia: ["en", "hi", "zh"],
  middleeast: ["ar", "en"],
  mena: ["ar", "en"],
};

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

/**
 * Minimal translation dictionaries
 */
const DICTIONARIES: Record<Language, Record<string, string>> = {
  en: {},
  es: {},
  fr: {},
  de: {},
  pt: {},
  it: {},
  ar: {},
  hi: {},
  zh: {},
};

/**
 * Translation helper
 */
export function t(key: string, lang?: string): string {
  const safeLang: Language = isLanguage(lang) ? lang : "en";
  const dict = DICTIONARIES[safeLang] ?? DICTIONARIES.en;
  return dict[key] ?? key;
}
