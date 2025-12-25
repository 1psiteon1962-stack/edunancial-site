// lib/content-resolver.ts

import { resolveRegion, Region } from "./regions";

export type PageContent = {
  heroTitle: string;
  heroSubtitle: string;
  region: Region;
};

export function resolvePageContent(regionId: string): PageContent {
  const region = resolveRegion(regionId);

  if (!region) {
    throw new Error(`Unknown region: ${regionId}`);
  }

  return {
    heroTitle: region.name,
    heroSubtitle: region.description,
    region,
  };
}
