// lib/i18n.ts

/**
 * Central i18n definitions.
 * This file MUST export:
 *  - Language
 *  - isLanguage
 *  - t (translator helper)
 */

/**
 * Supported languages.
 */
export const languages = ["en", "es"] as const;

/**
 * Language type used across the site.
 */
export type Language = (typeof languages)[number];

/**
 * Type guard to validate language strings.
 */
export function isLanguage(value: string): value is Language {
  return (languages as readonly string[]).includes(value);
}

/**
 * Minimal translation dictionary.
 * Expand this over time as content grows.
 */
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
 * Used by components importing { t } from "@/lib/i18n".
 */
export function t(lang: Language, key: string): string {
  return DICTIONARY[lang]?.[key] ?? key;
}
