export const DEFAULT_LANGUAGE = "en";

export type Language = "en" | "es" | "fr" | "de" | "ar";

export const SUPPORTED_LANGUAGES: Language[] = ["en", "es", "fr", "de", "ar"];

export function isLanguage(value: string): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

/**
 * Minimal translation helper (placeholder).
 * Keeps build happy and lets pages import `t`.
 */
export function t(key: string, _lang: Language = DEFAULT_LANGUAGE): string {
  return key;
}
