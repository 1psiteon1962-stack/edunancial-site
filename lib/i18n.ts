// lib/i18n.ts

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ar' | 'pt' | 'zh';

export const supportedLanguages: Language[] = [
  'en',
  'es',
  'fr',
  'de',
  'ar',
  'pt',
  'zh'
];

export const REGION_LANGUAGES: Record<string, Language[]> = {
  us: ['en', 'es'],
  africa: ['en', 'fr'],
  europe: ['en', 'fr', 'de'],
  eu: ['en', 'fr', 'de'],
  mena: ['en', 'ar'],
  asia: ['en', 'zh'],
  'asia-emerging': ['en'],
  'asia-pacific': ['en']
};

export function resolveCopy(
  lang: Language,
  copy: Record<Language, string>
): string {
  return copy[lang] ?? copy['en'];
}
