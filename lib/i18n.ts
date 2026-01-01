// lib/i18n.ts

export type Language =
  | "en"
  | "es"
  | "fr"
  | "pt"
  | "ar"
  | "sw"
  | "de"
  | "zh"
  | "hi"
  | "ja"
  | "ko";

export const supportedLanguages: Language[] = [
  "en",
  "es",
  "fr",
  "pt",
  "ar",
  "sw",
  "de",
  "zh",
  "hi",
  "ja",
  "ko",
];

// Optional helpers (safe to keep or remove)
export const DEFAULT_LANGUAGE: Language = "en";

export function isSupportedLanguage(lang: string): lang is Language {
  return supportedLanguages.includes(lang as Language);
}
