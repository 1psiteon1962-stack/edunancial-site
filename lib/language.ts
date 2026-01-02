// lib/language.ts

export const LANGUAGES = [
  "en",
  "es",
  "fr",
  "de",
  "ar",
  "zh",
  "ja",
  "hi",
] as const;

export type Language = typeof LANGUAGES[number];

export const isLanguage = (value: string): value is Language => {
  return LANGUAGES.includes(value as Language);
};

export type Region =
  | "us"
  | "europe"
  | "mena"
  | "africa"
  | "asia"
  | "asia-emerging"
  | "asia-pacific";

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  europe: "en",
  mena: "ar",
  africa: "en",
  asia: "zh",
  "asia-emerging": "hi",
  "asia-pacific": "ja",
};
