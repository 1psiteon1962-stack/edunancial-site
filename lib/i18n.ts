// lib/i18n.ts

export type Language =
  // Global default
  | "en"

  // Europe
  | "fr"
  | "es"
  | "pt"
  | "it"
  | "de"
  | "pl"
  | "nl"

  // Asia
  | "ja"
  | "ko"

  // Caribbean extras
  | "ht"

  // MENA
  | "ar";

export const LANGUAGES: Language[] = [
  // Global
  "en",

  // Europe
  "fr",
  "es",
  "pt",
  "it",
  "de",
  "pl",
  "nl",

  // Asia
  "ja",
  "ko",

  // Caribbean
  "ht",

  // MENA
  "ar",
];

export function isLanguage(x: string): x is Language {
  return LANGUAGES.includes(x as Language);
}

export function normalizeLanguage(x: string): Language {
  return isLanguage(x) ? (x as Language) : "en";
}
