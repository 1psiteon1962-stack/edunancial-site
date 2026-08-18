import regionRegistry from "../data/regions/index.json";

const REGION_ALIASES = {
  eu: "europe",
};

export function resolveRegionContent(regionKey) {
  const regions = regionRegistry.regions || {};
  const defaultRegion = regionRegistry.defaultRegion || "us";
  const normalized = String(regionKey || "").trim().toLowerCase();
  const canonicalKey = REGION_ALIASES[normalized] || normalized;

  return regions[canonicalKey] || regions[defaultRegion] || null;
}
