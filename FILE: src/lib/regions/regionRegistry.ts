export type RegionConfig = {
  code: string;
  currency: string;
  defaultLanguage: string;
  basePriceUSD: number;
  multiplier: number;
  active: boolean;
};

export const REGION_REGISTRY: Record<string, RegionConfig> = {
  us: {
    code: "us",
    currency: "USD",
    defaultLanguage: "en",
    basePriceUSD: 4.99,
    multiplier: 1,
    active: true,
  },
  latam: {
    code: "latam",
    currency: "USD",
    defaultLanguage: "es",
    basePriceUSD: 4.99,
    multiplier: 0.75,
    active: true,
  },
  eu: {
    code: "eu",
    currency: "EUR",
    defaultLanguage: "en",
    basePriceUSD: 4.99,
    multiplier: 1.1,
    active: true,
  },
  africa: {
    code: "africa",
    currency: "USD",
    defaultLanguage: "en",
    basePriceUSD: 4.99,
    multiplier: 0.6,
    active: true,
  },
};

export function getRegionConfig(code: string) {
  return REGION_REGISTRY[code] || REGION_REGISTRY["us"];
}

export function isValidRegion(code: string) {
  return Boolean(REGION_REGISTRY[code]?.active);
}
