// lib/content-registry.ts

import { regionCurriculumContent } from "./regionCurriculumContent";
import { DEFAULT_LANGUAGE_BY_REGION, type Language } from "./i18n";
import { type Region } from "./regions";

/**
 * Canonical page-level content contract
 */
export type PageContent = {
  heroTitle: string;
  heroDescription: string;
  title: string;
  description: string;
  tracks: {
    id: string;
    title: string;
    summary: string;
  }[];
};

/**
 * Resolve curriculum content into page-ready content
 * This adapter is INTENTIONAL and REQUIRED
 */
export function resolvePageContent(
  region: Region,
  lang: Language
): PageContent | null {
  const regionContent = regionCurriculumContent[region];
  if (!regionContent) return null;

  const localized =
    regionContent[lang] ??
    regionContent[DEFAULT_LANGUAGE_BY_REGION[region]];

  if (!localized) return null;

  return {
    heroTitle: localized.title,
    heroDescription: localized.description,
    title: localized.title,
    description: localized.description,
    tracks: localized.tracks,
  };
}
