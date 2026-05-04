export type CurriculumLanguage = "en" | "es";

export interface CurriculumSection {
  title: string;
  description: string;
}

export interface CurriculumLanguageContent {
  sections: CurriculumSection[];
}

export type RegionCurriculumContent = {
  en: CurriculumLanguageContent;
  es: CurriculumLanguageContent;
};
