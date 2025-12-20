export type Region =
  | "us"
  | "africa"
  | "latam"
  | "asia";

export const DEFAULT_REGION: Region = "us";

export function normalizeRegion(value?: string | null): Region {
  switch (value) {
    case "africa":
    case "latam":
    case "asia":
    case "us":
      return value;
    default:
      return DEFAULT_REGION;
  }
}
