import contentMap from "../data/content-map.json";

export function bindContent(region, productType) {
  const regionMap = contentMap[region] || contentMap["us"];
  return regionMap[productType] || [];
}
