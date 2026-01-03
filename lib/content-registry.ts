import { resolveRegion, Region } from "./regions";
import { Language, DEFAULT_LANGUAGE_BY_REGION } from "./language";
import { regionCurriculumContent } from "./regionCurriculumContent";

export type PageContent = {
  heroTitle: string;
  description: string;
};

export function getPageContent(
  regionSlug: string,
  lang: Language
): PageContent | null {
  const region = resolveRegion(regionSlug);
  if (!region) return null;

  const regionContent = regionCurriculumContent[region];
  if (!regionContent) return null;

  return (
    regionContent[lang] ??
    regionContent[DEFAULT_LANGUAGE_BY_REGION[region]]
  );
}
