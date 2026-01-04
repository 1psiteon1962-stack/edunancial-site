// lib/i18n.ts

export const supportedLanguages = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "ar",
] as const;

export type Language = (typeof supportedLanguages)[number];

export const REGION_LANGUAGES = {
  us: ["en", "es"],
  europe: ["en", "fr", "de", "es", "pt"],
  africa: ["en", "fr", "ar"],
  mena: ["ar", "en", "fr"],
  asia: ["en"],
} as const;

export type Region = keyof typeof REGION_LANGUAGES;

/**
 * Runtime guard
 */
export function isLanguage(value: string): value is Language {
  return (supportedLanguages as readonly string[]).includes(value);
}
