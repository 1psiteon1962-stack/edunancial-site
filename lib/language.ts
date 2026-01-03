import { Region } from "./regions";

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

export function isLanguage(value: string): value is Language {
  return LANGUAGES.includes(value as Language);
}

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  africa: "en",
  mena: "ar",
  asia: "en",
  "asia-emerging": "en",
  "asia-pacific": "en",
  europe: "en",
};
