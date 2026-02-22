import { getRegionConfig } from "@/lib/regions/regionRegistry";

export function getRegionalPrice(region: string) {
  const config = getRegionConfig(region);

  const adjusted = config.basePriceUSD * config.multiplier;

  return {
    region: config.code,
    currency: config.currency,
    price: Number(adjusted.toFixed(2)),
  };
}
