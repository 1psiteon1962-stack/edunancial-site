// src/lib/static-param.ts

import { REGION_LANGUAGES, type Language } from "./i18n";

export type StaticParam = {
  lang: Language;
  region: string;
};

/**
 * Central static param generator
 * Used by Next.js for SSG
 */
export function generateStaticParams(): StaticParam[] {
  const params: StaticParam[] = [];

  for (const [region, regionLanguages] of Object.entries(
    REGION_LANGUAGES
  ) as Array<[string, readonly Language[]]>) {
    for (const lang of regionLanguages) {
      params.push({ region, lang });
    }
  }

  return params;
}
