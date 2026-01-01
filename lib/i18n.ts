export type Language = 'en' | 'es' | 'fr' | 'ar' | 'zh';

export const REGION_LANGUAGES: Record<string, Language[]> = {
  us: ['en', 'es'],
  africa: ['en', 'fr'],
  asia: ['en', 'zh'],
  'asia-emerging': ['en'],
  'asia-pacific': ['en'],
  europe: ['en', 'fr'],
  eu: ['en', 'fr'],
  mena: ['en', 'ar'],
};

export function resolveCopy(
  copy: Record<Language, string>,
  lang: Language
): string {
  return copy[lang] ?? copy.en;
}
