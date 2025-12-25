import { REGION_LANGUAGES, Language } from "./i18n";

/**
 * Central static param generator
 * Use in every [lang] route
 */
export function generateLangParams(
  region: keyof typeof REGION_LANGUAGES
): { lang: Language }[] {
  return REGION_LANGUAGES[region].map((lang) => ({ lang }));
}
