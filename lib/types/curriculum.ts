// lib/types/curriculum.ts

export type CurriculumItem = {
  title: string;
  description: string;
  href?: string;
};

export interface RegionCurriculumEntry {
  title: string;
  description: string;
  curriculum: CurriculumItem[];
}

export type RegionCurriculumContent = {
  en: RegionCurriculumEntry;
  es: RegionCurriculumEntry;
};
