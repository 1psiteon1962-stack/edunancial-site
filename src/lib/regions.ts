/**
 * REGION TYPE
 */
export type Region = {
  slug: string;
  name: string;
  currency: string;
};

/**
 * MASTER REGION LIST
 * This now matches app/[region]/page.tsx expectations
 */
export const regions: Region[] = [
  { slug: "us", name: "United States", currency: "USD" },
  { slug: "latam", name: "Latin America", currency: "USD" },
  { slug: "africa", name: "Africa", currency: "USD" },
  { slug: "mena", name: "Middle East & North Africa", currency: "USD" },
  { slug: "asia", name: "Asia", currency: "USD" },
  { slug: "eu", name: "Europe", currency: "USD" }
];

/**
 * Type guard
 */
export function isRegionSlug(value: unknown): value is string {
  return (
    typeof value === "string" &&
    regions.some(r => r.slug === value)
  );
}

/**
 * Normalize route param
 */
export function normalizeRegion(input: unknown): string {
  if (typeof input !== "string") return "us";
  const v = input.toLowerCase().trim();
  return isRegionSlug(v) ? v : "us";
}

/**
 * Get region from env
 */
export function getRegionFromEnv(): string {
  const raw = process.env.SITE_REGION?.toLowerCase();
  return isRegionSlug(raw) ? raw : "us";
}
