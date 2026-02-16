// src/lib/i18n.ts

/**
 * Canonical language type for the entire application.
 * ALL language imports must come from this file.
 */
export type Language = "en" | "es";

/**
 * Runtime guard for validating language strings.
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
