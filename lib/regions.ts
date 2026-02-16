// lib/regions.ts

/**
 * Canonical region slug type.
 * This is the ONLY place regions are defined.
 */
export type Region = "global" | "us" | "latam";

/**
 * Region metadata used for routing and rendering.
 */
export interface RegionMeta {
  /** URL-safe identifier */
  slug: Region;

  /** Human-readable name */
  name: string;

  /** Client-side curriculum modules */
  clientModules: string[];

  /** Optional description */
  description?: string;
}

/**
 * Ordered list of supported regions.
 */
export const regions: RegionMeta[] = [
  {
    slug: "global",
    name: "Global",
    clientModules: ["doctrine", "curriculum", "principles"],
    description: "Default global curriculum",
  },
  {
    slug: "us",
    name: "United States",
    clientModules: ["doctrine", "tax", "markets"],
  },
  {
    slug: "latam",
    name: "Latin America",
    clientModules: ["doctrine", "currency", "informal-economy"],
  },
];
