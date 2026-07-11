/**
 * Supported curriculum language codes.
 * Add new language codes here to make them available without other code changes.
 */
export type CurriculumLanguage = "en" | "es" | "pt" | "fr" | "nl" | "de" | "it" | "ar";

export interface CurriculumSection {
  title: string;
  description: string;
}

export interface CurriculumLanguageContent {
  sections: CurriculumSection[];
}

/**
 * Region curriculum content keyed by language.
 * Uses Partial so regions only need to provide the languages they support.
 * Regions must include at least "en" as fallback.
 */
export type RegionCurriculumContent = Partial<Record<CurriculumLanguage, CurriculumLanguageContent>> & {
  en: CurriculumLanguageContent;
};
