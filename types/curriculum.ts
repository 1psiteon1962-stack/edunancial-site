// types/curriculum.ts

/**
 * Supported curriculum language codes.
 * Add new language codes here to make them available without other code changes.
 */
export type CurriculumLanguage = "en" | "es" | "pt" | "fr" | "nl" | "de" | "it" | "ar";

/**
 * One curriculum lesson/module
 */
export type CurriculumItem = {
  title: string;
  description: string;
  href?: string;
};

/**
 * Each region has a structured curriculum page:
 * - title + description at the top
 * - curriculum array of lessons/modules
 */
export type RegionCurriculumLocaleBlock = {
  title: string;
  description: string;
  curriculum: CurriculumItem[];
};

/**
 * Full region curriculum content keyed by language.
 * Uses Partial so regions only need to provide the languages they support.
 * Regions must include at least "en" as a fallback.
 */
export type RegionCurriculumContent = Partial<Record<CurriculumLanguage, RegionCurriculumLocaleBlock>> & {
  en: RegionCurriculumLocaleBlock;
};
