export const SUPPORTED_LANGUAGES = [
  "en",
  "es",
  "fr",
  "ar",
  "pt",
] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const REGION_LANGUAGES: Record<string, readonly Language[]> = {
  us: ["en", "es"],
  europe: ["en", "fr", "es"],
  latam: ["es", "pt"],
  caribbean: ["es", "fr", "nl"],
  mena: ["ar", "en", "fr"],
  africa: ["en", "fr"],
  asia: ["en"],
  "asia-pacific": ["en"],
  "asia-emerging": ["en"],
};

export function isLanguage(
  value: string,
  region: keyof typeof REGION_LANGUAGES
): value is Language {
  return REGION_LANGUAGES[region].includes(value as Language);
}
