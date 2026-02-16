// lib/regions.ts

export interface RegionMeta {
  /** URL-safe identifier used in routing */
  slug: string;

  /** Human-readable name */
  name: string;

  /** Client-side curriculum modules */
  clientModules: string[];

  /** Optional description */
  description?: string;
}

/**
 * Canonical list of supported regions.
 * The `slug` value MUST match the route segment.
 */
export const regions: RegionMeta[] = [
  {
    slug: "global",
    name: "Global",
    clientModules: [
      "doctrine",
      "curriculum",
      "principles",
    ],
    description: "Default global curriculum",
  },
  {
    slug: "us",
    name: "United States",
    clientModules: [
      "doctrine",
      "tax",
      "markets",
    ],
  },
  {
    slug: "latam",
    name: "Latin America",
    clientModules: [
      "doctrine",
      "currency",
      "informal-economy",
    ],
  },
];
