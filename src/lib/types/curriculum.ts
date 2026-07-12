export type CurriculumLanguage = "en" | "es" | "fr" | "de" | "it" | "pt" | "ar" | "sw" | "ja" | "ko" | "zh-Hans";

export interface CurriculumSection {
  title: string;
  description: string;
}

export interface CurriculumLanguageContent {
  sections: CurriculumSection[];
}

export type RegionCurriculumContent = {
  en: CurriculumLanguageContent;
} & Partial<Record<Exclude<CurriculumLanguage, "en">, CurriculumLanguageContent>>;
