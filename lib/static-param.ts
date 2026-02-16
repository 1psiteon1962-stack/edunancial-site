// lib/static-param.ts

import { REGION_LANGUAGES, type Language } from "./i18n";

export type StaticParam = {
  region: string;
  lang: Language;
};

/**
 * Central static param generator for Next.js SSG
 */
export function generateStaticParams(): StaticParam[] {
  const params: StaticParam[] = [];

  for (const region of Object.keys(REGION_LANGUAGES)) {
    for (const lang of REGION_LANGUAGES[region]) {
      params.push({ region, lang });
    }
  }

  return params;
}
