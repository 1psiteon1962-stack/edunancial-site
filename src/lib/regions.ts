export type RegionCode =
  | "us"
  | "latam"
  | "eu"
  | "africa"
  | "asia";

export type RegionConfig = {
  code: RegionCode;
  displayName: string;
  currency: string;
  language: string;
};

const REGION_MAP: Record<RegionCode, RegionConfig> = {
  us: {
    code: "us",
    displayName: "United States",
    currency: "USD",
    language: "en"
  },
  latam: {
    code: "latam",
    displayName: "Latin America",
    currency: "USD",
    language: "es"
  },
  eu: {
    code: "eu",
    displayName: "European Union",
    currency: "EUR",
    language: "en"
  },
  africa: {
    code: "africa",
    displayName: "Africa",
    currency: "USD",
    language: "en"
  },
  asia: {
    code: "asia",
    displayName: "Asia",
    currency: "USD",
    language: "en"
  }
};

export function getRegionConfig(region: string): RegionConfig {
  if (region in REGION_MAP) {
    return REGION_MAP[region as RegionCode];
  }

  return REGION_MAP.us;
}

export function getAllRegions(): RegionConfig[] {
  return Object.values(REGION_MAP);
}
