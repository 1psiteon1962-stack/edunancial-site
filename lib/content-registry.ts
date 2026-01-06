// lib/content-registry.ts

import type { Language, Region } from "./i18n";
import { DEFAULT_LANGUAGE_BY_REGION } from "./i18n";
import { regionCurriculumContent } from "./regionCurriculumContent";

export type ContentEntry = {
  region: Region;
  language: Language;
  content: unknown;
};

export const contentRegistry: ContentEntry[] = Object.entries(
  regionCurriculumContent
).flatMap(([region, languages]) => {
  const r = region as Region;

  return Object.entries(languages).map(([language, content]) => ({
    region: r,
    language: language as Language,
    content,
  }));
});

export function getContent(
  region: Region,
  language?: Language
) {
  const lang = language ?? DEFAULT_LANGUAGE_BY_REGION[region];

  return contentRegistry.find(
    (entry) =>
      entry.region === region && entry.language === lang
  )?.content;
}
