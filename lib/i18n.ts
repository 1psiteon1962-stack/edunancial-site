// lib/i18n.ts

export const LANGUAGES = [
  "en",
  "es",
  "fr",
  "de",
  "ar",
  "fa",
  "hi",
  "ru",
  "zh",
] as const;

export type Language = (typeof LANGUAGES)[number];

/**
 * Returns true if the string is a valid supported language code.
 */
export function isLanguage(value: string): value is Language {
  return (LANGUAGES as readonly string[]).includes(value);
}

/**
 * Normalize unknown input into a valid Language.
 */
export function normalizeLanguage(value: string | null | undefined): Language {
  if (!value) return "en";
  return isLanguage(value) ? value : "en";
}
