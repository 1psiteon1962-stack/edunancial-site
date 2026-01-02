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

export function isLanguage(value: string): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

export const DEFAULT_LANGUAGE_BY_REGION: Record<string, Language> = {
  us: "en",
  africa: "en",
  europe: "en",
  mena: "ar",
  asia: "en",
  "asia-pacific": "en",
  "asia-emerging": "en",
};
