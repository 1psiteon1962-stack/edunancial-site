// lib/i18n.ts

export const TRANSLATIONS = {
  en: {
    home_title: "Welcome to Edunancial",
    home_subtitle: "Financial education built for real people",
  },
  es: {
    home_title: "Bienvenido a Edunancial",
    home_subtitle: "Educación financiera para personas reales",
  },
} as const;

/**
 * Language type
 * This is what WAS MISSING and caused 3 days of failure
 */
export type Language = keyof typeof TRANSLATIONS;

/**
 * Default language
 */
export const DEFAULT_LANGUAGE: Language = "en";

/**
 * Type guard
 */
export function isLanguage(value: string): value is Language {
  return value in TRANSLATIONS;
}

/**
 * Translation helper
 */
export function t(key: keyof (typeof TRANSLATIONS)[Language], lang: Language) {
  return TRANSLATIONS[lang][key];
}
