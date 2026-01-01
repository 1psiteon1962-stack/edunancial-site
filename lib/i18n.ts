export const supportedLanguages = ["en", "es"] as const;
export type Language = typeof supportedLanguages[number];

export const defaultLanguage: Language = "en";

/**
 * REGION → SUPPORTED LANGUAGES
 */
export const REGION_LANGUAGES: Record<string, Language[]> = {
  africa: ["en", "es"],
  europe: ["en", "es"],
  eu: ["en", "es"],
  mena: ["en", "es"],
  "asia-pacific": ["en"],
  "asia-emerging": ["en"],
};

/**
 * Resolve localized copy safely
 */
export function resolveCopy<T>(
  lang: Language,
  contentMap: Record<Language, T>
): T {
  return contentMap[lang] ?? contentMap[defaultLanguage];
}
