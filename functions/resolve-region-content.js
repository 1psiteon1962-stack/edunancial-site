import regions from "../data/regions/index.json";

export function resolveRegionContent(regionKey) {
  return regions[regionKey] || regions["us"];
}
