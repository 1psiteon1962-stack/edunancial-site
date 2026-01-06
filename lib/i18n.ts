export const SUPPORTED_LANGUAGES = ["en", "es", "fr", "ar", "pt"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const REGION_LANGUAGES = {
  us: ["en", "es"] as const,
  europe: ["en", "fr"] as const,
  latam: ["es"] as const,
  caribbean: ["en", "es", "fr", "pt"] as const,
  mena: ["ar", "fr", "en"] as const,
  africa: ["en", "fr", "pt", "ar"] as const,
  asia: ["en"] as const,
  "asia-pacific": ["en"] as const,
  "asia-emerging": ["en"] as const,
} satisfies Record<string, readonly Language[]>;

/**
 * Type guard: validates language + region compatibility
 */
export function isLanguage(
  value: string,
  region: keyof typeof REGION_LANGUAGES
): value is Language {
  return REGION_LANGUAGES[region].includes(value as Language);
}

/**
 * Translation helper used by LocalizedDoctrine
 */
export function t(key: string, lang: Language): string {
  return `${key} [${lang}]`;
}
