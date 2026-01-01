export type Language = 'en' | 'es' | 'pt';

export const REGION_LANGUAGES: Record<string, Language[]> = {
  us: ['en', 'es'],
  africa: ['en', 'pt'],
  asia: ['en'],
  'asia-pacific': ['en'],
  'asia-emerging': ['en'],
  europe: ['en', 'es', 'pt'],
  mena: ['en']
};

export function resolveCopy<T>(
  lang: Language,
  map: Record<Language, T>
): T {
  return map[lang] ?? map.en;
}
