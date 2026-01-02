// lib/i18n.ts

export const REGION_LANGUAGES = {
  us: ['en', 'es'],
  africa: ['en', 'fr'],
  europe: ['en', 'fr', 'es'],
  asia: ['en'],
  'asia-emerging': ['en'],
  mena: ['en', 'ar'],
} as const;

export type Region = keyof typeof REGION_LANGUAGES;
export type Language = typeof REGION_LANGUAGES[Region][number];

export const supportedLanguages: Language[] = [
  'en',
  'es',
  'fr',
  'ar',
];

export function resolveCopy<T>(
  lang: Language,
  map: Record<Language, T>
): T {
  return map[lang] ?? map.en;
}
