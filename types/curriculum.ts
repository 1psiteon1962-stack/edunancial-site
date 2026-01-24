// types/curriculum.ts

export type CurriculumLanguage = "en" | "es";

/**
 * One curriculum entry (one lesson/module)
 */
export type CurriculumItem = {
  title: string;
  description: string;
  href?: string; // optional link to the page/resource
};

/**
 * Region curriculum structure:
 * - Keys are level names or topic groups
 * - Values are lists of curriculum items
 */
export type RegionCurriculumContent = Record<
  CurriculumLanguage,
  Record<string, CurriculumItem[]>
>;
