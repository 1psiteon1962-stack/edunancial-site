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

export type Language = (typeof LANGUAGES)[number];

export const isLanguage = (value: string): value is Language => {
  return (LANGUAGES as readonly string[]).includes(value);
};

export type Region =
  | "us"
  | "africa"
  | "asia"
  | "asia-emerging"
  | "asia-pacific"
  | "europe"
  | "mena";

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  africa: "en",
  asia: "en",
  "asia-emerging": "en",
  "asia-pacific": "en",
  europe: "en",
  mena: "ar",
};
