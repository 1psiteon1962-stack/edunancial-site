// lib/i18n.ts

export const REGION_LANGUAGES = {
  us: ['en', 'es'],
  africa: ['en', 'fr', 'ar'],
  europe: ['en', 'fr'],
  asia: ['en'],
  'asia-emerging': ['en'],
  'asia-pacific': ['en'],
  mena: ['en', 'ar'],
} as const;

export type Region = keyof typeof REGION_LANGUAGES;
export type Language = (typeof REGION_LANGUAGES)[Region][number];

export function resolveCopy<T>(
  lang: Language,
  map: Record<Language, T>
): T {
  return map[lang] ?? map.en;
}

export const supportedLanguages: Language[] = ['en', 'es', 'fr', 'ar'];
