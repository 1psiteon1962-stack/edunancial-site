export const supportedLanguages = ["en", "es"] as const;
export type Language = typeof supportedLanguages[number];

export const defaultLanguage: Language = "en";

/**
 * Region → allowed languages
 * Extend later without breaking routes
 */
export const REGION_LANGUAGES: Record<string, Language[]> = {
  africa: ["en", "es"],
  europe: ["en", "es"],
  mena: ["en", "es"],
  asia: ["en", "es"],
  "asia-pacific": ["en"],
  "asia-emerging": ["en"],
};

/**
 * Resolves copy safely by language
 */
export function resolveCopy<T>(
  contentMap: Record<Language, T>,
  lang: Language,
  fallback: Language = defaultLanguage
): T {
  return contentMap[lang] ?? contentMap[fallback];
}
