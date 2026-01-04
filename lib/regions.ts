// lib/regions.ts

export type Region =
  | "us"
  | "latam"
  | "europe"
  | "africa"
  | "asia"
  | "asia-pacific"
  | "asia-emerging"
  | "mena";

/**
 * Resolves an arbitrary region string into a supported Region.
 * Falls back safely to "us" if the input is invalid.
 */
export function resolveRegion(input: string): Region {
  const normalized = input.toLowerCase();

  const supported: Region[] = [
    "us",
    "latam",
    "europe",
    "africa",
    "asia",
    "asia-pacific",
    "asia-emerging",
    "mena",
  ];

  if (supported.includes(normalized as Region)) {
    return normalized as Region;
  }

  return "us";
}
