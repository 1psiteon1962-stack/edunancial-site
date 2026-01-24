// types/curriculum.ts

export type CurriculumLanguage = "en" | "es";

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
 * Full region curriculum content:
 * Example:
 * {
 *   en: { title, description, curriculum: [...] },
 *   es: { title, description, curriculum: [...] }
 * }
 */
export type RegionCurriculumContent = Record<
  CurriculumLanguage,
  RegionCurriculumLocaleBlock
>;
