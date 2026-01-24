// lib/i18n/core.ts

export const SUPPORTED_LANGUAGES = ["en", "es"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "en";

export function isLanguage(value: string): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

/**
 * Minimal translation helper.
 * Expand later with full dictionaries.
 */
export function t(key: string, lang: Language = DEFAULT_LANGUAGE): string {
  const dictionary: Record<Language, Record<string, string>> = {
    en: {
      welcome: "Welcome",
    },
    es: {
      welcome: "Bienvenido",
    },
  };

  return dictionary[lang]?.[key] ?? key;
}
