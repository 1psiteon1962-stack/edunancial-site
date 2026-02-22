/**
 * MASTER REGION REGISTRY
 *
 * This file MUST:
 * - Export a named `regions` array (because app/[region]/page.tsx expects it)
 * - Export helpers for validation
 * - Never throw
 * - Never break US site if mirrors are incomplete
 */

export type RegionCode =
  | "us"
  | "latam"
  | "africa"
  | "mena"
  | "asia"
  | "eu";

/**
 * Canonical region list
 * This satisfies:
 * import { regions } from "@/lib/regions"
 */
export const regions: RegionCode[] = [
  "us",
  "latam",
  "africa",
  "mena",
  "asia",
  "eu"
];

/**
 * Region metadata map
 */
export const RegionMeta: Record<RegionCode, {
  name: string;
  currency: string;
}> = {
  us: { name: "United States", currency: "USD" },
  latam: { name: "Latin America", currency: "USD" },
  africa: { name: "Africa", currency: "USD" },
  mena: { name: "Middle East & North Africa", currency: "USD" },
  asia: { name: "Asia", currency: "USD" },
  eu: { name: "Europe", currency: "USD" }
};

/**
 * Type guard
 */
export function isRegion(value: unknown): value is RegionCode {
  return typeof value === "string" && regions.includes(value as RegionCode);
}

/**
 * Normalize incoming route param
 */
export function normalizeRegion(input: unknown): RegionCode {
  if (typeof input !== "string") return "us";
  const v = input.toLowerCase().trim();
  return isRegion(v) ? v : "us";
}

/**
 * Environment region fallback
 */
export function getRegionFromEnv(): RegionCode {
  const raw = process.env.SITE_REGION?.toLowerCase();
  return isRegion(raw) ? raw : "us";
}
