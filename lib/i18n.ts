// lib/i18n.ts

// --------------------
// Languages (FINAL)
// --------------------
export type Language =
  | 'en'
  | 'es'
  | 'fr'
  | 'pt'
  | 'nl'
  | 'ar';

// --------------------
// Regions (FINAL)
// --------------------
export type Region =
  | 'us'
  | 'latam'
  | 'caribbean'
  | 'europe'
  | 'africa'
  | 'mena'
  | 'asia';

// --------------------
// Region → Languages
// --------------------
export const REGION_LANGUAGES: Record<Region, readonly Language[]> = {
  us: ['en', 'es'],
  latam: ['es', 'pt'],
  caribbean: ['en', 'es', 'fr', 'nl'],
  europe: ['en', 'fr', 'es', 'pt'],
  africa: ['en', 'fr', 'ar'],
  mena: ['ar', 'en', 'fr'],
  asia: ['en'],
} as const;

// --------------------
// Default language per region
// --------------------
export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: 'en',
  latam: 'es',
  caribbean: 'en',
  europe: 'en',
  africa: 'en',
  mena: 'ar',
  asia: 'en',
};

// --------------------
// Language guard
// --------------------
export function isLanguage(value: string): value is Language {
  return (
    value === 'en' ||
    value === 'es' ||
    value === 'fr' ||
    value === 'pt' ||
    value === 'nl' ||
    value === 'ar'
  );
}
