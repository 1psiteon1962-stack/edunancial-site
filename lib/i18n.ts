// lib/i18n.ts

/* =========================
   LANGUAGES
========================= */

export const supportedLanguages = ['en', 'es', 'fr'] as const;
export type Language = (typeof supportedLanguages)[number];

/* =========================
   REGIONS → LANGUAGES
========================= */

export const REGION_LANGUAGES: Record<string, Language[]> = {
  us: ['en', 'es'],
  africa: ['en', 'fr'],
  europe: ['en', 'fr', 'es'],
  asia: ['en'],
  'asia-emerging': ['en'],
  'asia-pacific': ['en'],
  mena: ['en', 'fr'],
};

/* =========================
   LOCALIZED COPY RESOLVER
========================= */

export function resolveCopy<T>(
  lang: Language,
  contentMap: Record<Language, T>
): T {
  return contentMap[lang] ?? contentMap.en;
}
