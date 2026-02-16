// lib/i18n.ts

/**
 * Supported application languages.
 * This is the canonical Language type used across the codebase.
 */
export type Language = "en" | "es";

/**
 * Runtime language guard.
 */
export function isLanguage(value: string): value is Language {
  return value === "en" || value === "es";
}

/**
 * Translation dictionaries.
 */
const dictionaries: Record<Language, Record<string, string>> = {
  en: {
    welcome: "Welcome",
  },
  es: {
    welcome: "Bienvenido",
  },
};

/**
 * Translation helper.
 */
export function t(lang: Language, key: string): string {
  return dictionaries[lang]?.[key] ?? key;
}
