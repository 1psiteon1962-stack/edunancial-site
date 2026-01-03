// lib/i18n.ts

export const supportedLanguages = ["en", "es", "fr", "de", "ar"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

/**
 * Canonical defaults
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = "en";
export const DEFAULT_LANG: SupportedLanguage = DEFAULT_LANGUAGE;

/**
 * Language guards
 */
export function isSupportedLanguage(
  value: string
): value is SupportedLanguage {
  return (supportedLanguages as readonly string[]).includes(value);
}

// Backward compatibility for existing imports
export const isSupportedLang = isSupportedLanguage;

/**
 * Region → allowed languages
 */
export const REGION_LANGUAGES: Record<string, SupportedLanguage[]> = {
  us: ["en", "es"],
  eu: ["en", "fr", "de"],
  africa: ["en", "fr", "ar"],
  asia: ["en"],
  latam: ["es"],
};

/**
 * Simple dictionary helper
 */
export function t(
  key: string,
  lang: SupportedLanguage = DEFAULT_LANGUAGE
): string {
  const dict: Record<string, Record<SupportedLanguage, string>> = {
    missionTitle: {
      en: "Financial Literacy for Real Life",
      es: "Educación financiera para la vida real",
      fr: "Littératie financière pour la vraie vie",
      de: "Finanzielle Bildung für das echte Leben",
      ar: "الثقافة المالية للحياة الواقعية",
    },
  };

  return dict[key]?.[lang] ?? dict[key]?.[DEFAULT_LANGUAGE] ?? key;
}
