// lib/i18n.ts

/* =========================
   LANGUAGE TYPES
========================= */

export type Language = 'en' | 'es' | 'fr' | 'pt';

/* =========================
   SUPPORTED LANGUAGES (GLOBAL)
========================= */

export const supportedLanguages: Language[] = ['en', 'es', 'fr', 'pt'];

/* =========================
   REGION → LANGUAGE MAP
========================= */

export const REGION_LANGUAGES: Record<string, Language[]> = {
  us: ['en', 'es'],
  africa: ['en', 'fr', 'pt'],
  asia: ['en'],
  'asia-emerging': ['en'],
  'asia-pacific': ['en'],
  europe: ['en', 'fr'],
  eu: ['en', 'fr'],
  mena: ['en', 'fr'],
  latam: ['es', 'pt'],
};

/* =========================
   LOCALIZED COPY RESOLVER
========================= */

export function resolveCopy<T>(
  lang: Language,
  contentMap: Record<Language, T>
): T {
  if (contentMap[lang]) return contentMap[lang];
  return contentMap.en; // safe fallback
}
