// lib/content-registry.ts

import {
  Language,
  Region,
  DEFAULT_LANGUAGE_BY_REGION,
} from "./i18n";
import { regionCurriculumContent } from "./regionCurriculumContent";

export type PageContent = {
  heroTitle: string;
  heroDescription: string;
  title: string;
  description: string;
};

export function resolveContent(
  region: Region,
  lang: Language
): PageContent | null {
  const regionContent = regionCurriculumContent[region];
  if (!regionContent) return null;

  return (
    regionContent[lang] ??
    regionContent[DEFAULT_LANGUAGE_BY_REGION[region]]
  );
}
