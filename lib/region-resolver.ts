export type Region =
  | "US"
  | "LATAM"
  | "AFRICA"
  | "EU"
  | "MENA"
  | "ASIA"
  | "GLOBAL";

export function resolveRegion(): Region {
  // Server-safe default. Later you can enhance using headers, geo, query params, etc.
  return "GLOBAL";
}
