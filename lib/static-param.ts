// lib/static-param.ts

import { REGION_LANGUAGES, type Language } from "./i18n";

/**
 * Central static param generator
 * Used by Next.js for locale + region routing.
 */
export function generateStaticParams() {
  return Object.entries(REGION_LANGUAGES).map(([region, lang]) => ({
    region,
    lang: lang as Language,
  }));
}
