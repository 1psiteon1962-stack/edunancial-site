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
  return LANGUAGES.includes(value as Language);
};

export type Region =
  | "us"
  | "africa"
  | "europe"
  | "asia"
  | "asia-pacific"
  | "asia-emerging"
  | "mena";

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  africa: "en",
  europe: "en",
  asia: "en",
  "asia-pacific": "en",
  "asia-emerging": "en",
  mena: "ar",
};
