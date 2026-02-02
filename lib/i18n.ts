// lib/i18n.ts

export type LanguageCode = "en" | "es";

const DICTIONARY: Record<LanguageCode, Record<string, string>> = {
  en: {
    doctrine: "Doctrine and legal principles content goes here.",
    welcome: "Welcome",
  },
  es: {
    doctrine: "El contenido de doctrina y principios legales va aquí.",
    welcome: "Bienvenido",
  },
};

/**
 * Translation helper.
 * Usage:
 *   t("en", "doctrine")
 */
export function t(lang: LanguageCode, key: string): string {
  const table = DICTIONARY[lang] ?? DICTIONARY.en;
  return table[key] ?? key;
}
