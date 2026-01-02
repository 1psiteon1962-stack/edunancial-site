// lib/language.ts

export const SUPPORTED_LANGUAGES = [
  "en",
  "es",
  "fr",
  "de",
  "ar",
  "zh",
  "ja",
  "hi",
] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];
