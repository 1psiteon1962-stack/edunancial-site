import {
  CanonicalRegionCode,
  REGION_ARCHITECTURE,
  RegionArchitectureConfig,
  RegionLaunchState,
} from "./architecture";

const REGION_ALIASES: Record<string, CanonicalRegionCode> = {
  root: "north-america",
  us: "north-america",
  usa: "north-america",
  ca: "north-america",
  canada: "north-america",
  "north-america": "north-america",
  na: "north-america",
  eu: "europe",
  europe: "europe",
  latam: "latin-america",
  "latin-america": "latin-america",
  caribbean: "caribbean",
  africa: "africa",
  mena: "mena",
  asia: "asia-pacific",
  "asia-pacific": "asia-pacific",
  "asia-emerging": "asia-pacific",
  oceania: "oceania",
};

export function resolveCanonicalRegionCode(value: string | null | undefined): CanonicalRegionCode | null {
  if (!value) return null;
  return REGION_ALIASES[value.trim().toLowerCase()] ?? null;
}

export function getResolvedRegion(value: string | null | undefined): RegionArchitectureConfig | null {
  const code = resolveCanonicalRegionCode(value);
  return code ? REGION_ARCHITECTURE[code] : null;
}

export function isRegionAccessible(
  value: string | null | undefined,
  allowedStates: readonly RegionLaunchState[] = ["ACTIVE"],
): boolean {
  const region = getResolvedRegion(value);
  return Boolean(region && allowedStates.includes(region.launchState));
}

export function getCanonicalRegionForCountry(countryCode: string): CanonicalRegionCode | null {
  const normalized = countryCode.trim().toUpperCase();
  for (const region of Object.values(REGION_ARCHITECTURE)) {
    if (region.countries.some((country) => country.countryCode === normalized)) return region.code;
  }
  return null;
}
