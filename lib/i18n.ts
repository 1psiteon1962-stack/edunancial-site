// lib/i18n.ts

export const supportedLanguages = ['en', 'es', 'fr'] as const;
export type Language = typeof supportedLanguages[number];

export const REGION_LANGUAGES: Record<
  'us' | 'africa' | 'asia' | 'asia-emerging' | 'asia-pacific' | 'europe' | 'mena',
  Language[]
> = {
  us: ['en', 'es'],
  africa: ['en', 'fr'],
  asia: ['en'],
  'asia-emerging': ['en'],
  'asia-pacific': ['en'],
  europe: ['en', 'fr'],
  mena: ['en'],
};

export function resolveCopy<T>(
  lang: Language,
  map: Record<Language, T>
): T {
  return map[lang] ?? map.en;
}
