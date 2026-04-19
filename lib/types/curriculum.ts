// lib/types/curriculum.ts

import { Language } from "../core";

// ✅ STRUCTURE USED BY europe.ts AND OTHER REGIONS
export type CurriculumSection = {
  title: string;
  description: string;
};

export type CurriculumContent = {
  sections: CurriculumSection[];
};

// ✅ REGION-LEVEL CONTENT (MULTI-LANGUAGE)
export type RegionCurriculumContent = {
  [key in Language]?: CurriculumContent;
};
