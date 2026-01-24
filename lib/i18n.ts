// lib/i18n.ts

export const DEFAULT_LANGUAGE = "en" as const;

/**
 * Region -> supported languages.
 * Keep this small and explicit so static params are deterministic.
 */
export const REGION_LANGUAGES = {
  us: ["en", "es"],
  europe: ["en"],
  latam: ["es", "en"],
  mena: ["en", "ar"],
  africa: ["en", "fr"],
  caribbean: ["en", "es"],
  asia: ["en"],
} as const;

export type RegionCode = keyof typeof REGION_LANGUAGES;
export type Language = (typeof REGION_LANGUAGES)[RegionCode][number];

/**
 * A flattened list used by UI + validation.
 */
export const SUPPORTED_LANGUAGES = Array.from(
  new Set(Object.values(REGION_LANGUAGES).flat())
) as Language[];

export function isLanguage(value: string): value is Language {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

type Dictionary = Record<string, string>;

/**
 * Minimal dictionaries (extend as needed).
 * IMPORTANT: Keep keys stable; missing keys fall back to the key itself.
 */
const DICTS: Record<Language, Dictionary> = {
  en: {},
  es: {},
  ar: {},
  fr: {},
} as Record<Language, Dictionary>;

/**
 * Translation helper
 */
export function t(key: string, lang: Language = DEFAULT_LANGUAGE): string {
  const dict = DICTS[lang] ?? DICTS[DEFAULT_LANGUAGE];
  return dict?.[key] ?? key;
}
