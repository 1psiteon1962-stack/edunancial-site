export const REGIONS = [
  "us",
  "africa",
  "mena",
  "asia",
  "asia-emerging",
  "asia-pacific",
  "europe",
] as const;

export type Region = (typeof REGIONS)[number];

export function resolveRegion(value: string): Region | null {
  return REGIONS.includes(value as Region) ? (value as Region) : null;
}
