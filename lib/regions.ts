export type Region =
  | "US"
  | "IN"
  | "SG"
  | "AU"
  | "HK"
  | "GLOBAL";

export function resolveRegion(input?: string | null): Region {
  if (!input) return "US";

  const region = input.toUpperCase();

  if (["US", "IN", "SG", "AU", "HK"].includes(region)) {
    return region as Region;
  }

  return "GLOBAL";
}
