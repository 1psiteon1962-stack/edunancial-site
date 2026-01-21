// app/lib/i18n.ts

export const translations = {
  en: {
    homeTitle: "Welcome to Edunancial",
    homeSubtitle: "Financial literacy starts here",
  },
  es: {
    homeTitle: "Bienvenido a Edunancial",
    homeSubtitle: "La educación financiera comienza aquí",
  },
} as const;

/**
 * Language type
 * This is the SINGLE source of truth.
 */
export type Language = keyof typeof translations;

/**
 * Default language
 */
export const DEFAULT_LANGUAGE: Language = "en";

/**
 * Type guard
 */
export function isLanguage(value: string): value is Language {
  return value in translations;
}

/**
 * Translation helper
 */
export function t(
  key: keyof (typeof translations)[Language],
  lang: Language = DEFAULT_LANGUAGE
): string {
  return translations[lang][key];
}
