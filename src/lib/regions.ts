type RegionLike = {
  slug: string;
  clientModules?: unknown[];
  [key: string]: unknown;
};

/**
 * SAFE REGION SOURCE
 * This file is designed to prevent build crashes even if content
 * is missing or malformed during Netlify build.
 */
const REGIONS: RegionLike[] = [
  {
    slug: "us",
    clientModules: [],
  },
];

/**
 * Safe region lookup.
 */
export function getRegion(slug: string): RegionLike | undefined {
  return REGIONS.find((region) => region.slug === slug);
}

/**
 * Optional helper export if any other file needs all regions.
 */
export function getRegions(): RegionLike[] {
  return REGIONS;
}
