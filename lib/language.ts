// lib/language.ts

export const languages = ["en", "es", "fr", "de", "ar"] as const;
export type Language = (typeof languages)[number];

export const regions = ["us", "africa", "asia", "europe", "latam"] as const;
export type Region = (typeof regions)[number];

export function isLanguage(value: string): value is Language {
  return (languages as readonly string[]).includes(value);
}

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  africa: "en",
  asia: "en",
  europe: "en",
  latam: "es"
};
