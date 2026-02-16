// lib/i18n.ts

/**
 * Supported languages
 * Keep this narrow and explicit so indexing is safe.
 */
export type Language = "en" | "es";

/**
 * Dictionaries MUST be typed with a string index signature
 * to allow dictionaries[lang][key]
 */
const dictionaries: Record<Language, Record<string, string>> = {
  en: {
    welcome: "Welcome",
    signup: "Sign up",
    login: "Log in",
  },

  es: {
    welcome: "Bienvenido",
    signup: "Regístrate",
    login: "Iniciar sesión",
  },
};

/**
 * Translation helper
 * Always returns a string (falls back to key)
 */
export function t(lang: Language, key: string): string {
  return dictionaries[lang]?.[key] ?? key;
}
