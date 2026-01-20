// src/data/regions/index.ts

export type RegionCode = "us" | "latam" | "mena" | "eu" | "africa" | "asia";

export type RegionDefinition = {
  code: RegionCode;
  name: string;
  description: string;
  path: string; // route path
};

export const REGIONS: RegionDefinition[] = [
  {
    code: "us",
    name: "United States",
    description: "Core U.S. experience, pricing, and tools.",
    path: "/us",
  },
  {
    code: "latam",
    name: "Latin America",
    description: "LATAM experience and localized resources.",
    path: "/latam",
  },
  {
    code: "mena",
    name: "MENA",
    description: "Middle East & North Africa experience.",
    path: "/mena",
  },
  {
    code: "eu",
    name: "Europe",
    description: "EU experience and localized resources.",
    path: "/eu",
  },
  {
    code: "africa",
    name: "Africa",
    description: "Africa experience and localized resources.",
    path: "/africa",
  },
  {
    code: "asia",
    name: "Asia",
    description: "Asia experience and localized resources.",
    path: "/asia",
  },
];
