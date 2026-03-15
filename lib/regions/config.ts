/*
REGION CONFIGURATION
This file guarantees that every region lookup returns a valid object.
The root region MUST exist or Next.js prerender of "/" will crash.
*/

export type RegionConfig = {
  slug: string;
  name: string;
  clientModules: any[];
};

export const regions: RegionConfig[] = [
  {
    slug: "root",
    name: "Global",
    clientModules: []
  },
  {
    slug: "us",
    name: "United States",
    clientModules: []
  },
  {
    slug: "eu",
    name: "Europe",
    clientModules: []
  },
  {
    slug: "latam",
    name: "Latin America",
    clientModules: []
  },
  {
    slug: "africa",
    name: "Africa",
    clientModules: []
  },
  {
    slug: "mena",
    name: "Middle East & North Africa",
    clientModules: []
  },
  {
    slug: "asia",
    name: "Asia",
    clientModules: []
  }
];

export const defaultRegion: RegionConfig = {
  slug: "root",
  name: "Global",
  clientModules: []
};

export function getRegionContent(slug: string): RegionConfig {
  const region = regions.find((r) => r.slug === slug);
  return region ?? defaultRegion;
}
