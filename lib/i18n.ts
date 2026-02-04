// lib/i18n.ts

/**
 * Supported languages (single source of truth)
 */
export type Language = "en" | "es";

/**
 * Region → Supported language mapping
 * Used by static param generation and localization routing.
 */
export const REGION_LANGUAGES: Record<string, Language> = {
  us: "en",
  pr: "es",
  dr: "es",
  latam: "es",
  eu: "en",
};

/**
 * Translation dictionary (minimal starter)
 */
const DICTIONARY: Record<Language, Record<string, string>> = {
  en: {
    doctrine_title: "Doctrine",
    doctrine_body: "Education is the foundation of wealth-building systems.",
  },
  es: {
    doctrine_title: "Doctrina",
    doctrine_body: "La educación es la base de los sistemas de creación de riqueza.",
  },
};

/**
 * Core translation helper
 */
export function t(lang: Language, key: string): string {
  return DICTIONARY[lang]?.[key] ?? key;
}
