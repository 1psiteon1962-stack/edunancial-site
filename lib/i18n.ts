// lib/i18n.ts

export type LanguageCode = "en" | "es" | "fr" | "pt" | "ar";

export const supportedLanguages: LanguageCode[] = [
  "en",
  "es",
  "fr",
  "pt",
  "ar",
];

export function isValidLanguage(lang: string): lang is LanguageCode {
  return supportedLanguages.includes(lang as LanguageCode);
}
