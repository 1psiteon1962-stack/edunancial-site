// lib/i18n.ts

/**
 * Supported languages
 */
export type Language =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "it"
  | "ar"
  | "hi"
  | "zh";

/**
 * Default language per region.
 * THIS is the single source of truth for regions.
 */
export const DEFAULT_LANGUAGE_BY_REGION = {
  us: "en",
  pr: "es",
  latam: "es",
  eu: "en",
  africa: "en",
  asia: "en",
  middleeast: "ar",
} as const;

/**
 * Region type derived from defaults
 */
export type Region = keyof typeof DEFAULT_LANGUAGE_BY_REGION;

/**
 * Normalize language safely
 */
export function normalizeLanguage(
  lang: unknown,
  fallback: Language = "en"
): Language {
  if (typeof lang !== "string") return fallback;
  return (Object.values(DEFAULT_LANGUAGE_BY_REGION) as readonly string[]).includes(
    lang
  )
    ? (lang as Language)
    : fallback;
}

/**
 * Get default language for region
 */
export function getDefaultLanguage(region: Region): Language {
  return DEFAULT_LANGUAGE_BY_REGION[region];
}
