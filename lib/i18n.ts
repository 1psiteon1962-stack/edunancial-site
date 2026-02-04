// lib/i18n.ts

/**
 * Central i18n module.
 * This file MUST export:
 *  - Language
 *  - isLanguage
 *  - t()
 *
 * t() is hardened to accept ANY string input safely,
 * so TypeScript never breaks builds due to locale typing.
 */

export const languages = ["en", "es"] as const;

export type Language = (typeof languages)[number];

export function isLanguage(value: string): value is Language {
  return (languages as readonly string[]).includes(value);
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  en: {
    doctrine_title: "Doctrine",
    doctrine_body: "This is the English doctrine text.",
  },
  es: {
    doctrine_title: "Doctrina",
    doctrine_body: "Este es el texto doctrinal en español.",
  },
};

/**
 * Translator helper.
 * Accepts ANY string safely and normalizes internally.
 * This permanently prevents TypeScript failures like:
 *
 *   Argument of type 'string' is not assignable to '"en" | "es"'
 */
export function t(lang: string, key: string): string {
  const safeLang: Language = isLanguage(lang) ? lang : "en";
  return DICTIONARY[safeLang]?.[key] ?? key;
}
