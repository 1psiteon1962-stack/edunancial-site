// lib/content-resolver.ts

import { resolveRegion, Region } from "./regions";
import { Language, DEFAULT_LANGUAGE_BY_REGION } from "./language";

export type PageContent = {
  heroTitle: string;
  heroSubtitle: string;
  region: Region;
  language: Language;
};

/**
 * Single authoritative content resolver.
 * No education claims. No advice language.
 */
export function resolvePageContent(
  regionId: string,
  languageOverride?: Language
): PageContent {
  const region =
    resolveRegion(regionId) ??
    resolveRegion("US")!;

  const language =
    languageOverride ??
    DEFAULT_LANGUAGE_BY_REGION[region.id];

  return {
    heroTitle: "Edunancial",
    heroSubtitle:
      "Global knowledge and infrastructure systems for real-world economic environments.",
    region,
    language,
  };
}
