import { REGION_REGISTRY, type RegionCode, type RegionDefinition } from "./engine";

export interface RegionalManagementRow {
  slug: RegionCode;
  name: string;
  enabled: boolean;
  supportedCurrencies: string[];
  supportedLanguages: string[];
  status: "active" | "beta" | "planned" | "disabled";
  translationCompletion: number;
  localizationCompletion: number;
  legalNoticeCount: number;
}

/** Returns data rows for the regional management admin table. */
export function getRegionalManagementRows(): RegionalManagementRow[] {
  return (Object.keys(REGION_REGISTRY) as RegionCode[]).map((code) => {
    const def: RegionDefinition = REGION_REGISTRY[code];
    return {
      slug: def.code,
      name: def.name,
      enabled: def.enabled,
      supportedCurrencies: [...def.currencies],
      supportedLanguages: [...def.locales],
      status: def.enabled ? (def.code === "north-america" ? "active" : "beta") : "planned",
      translationCompletion: def.enabled ? (def.code === "north-america" ? 100 : 80) : 0,
      localizationCompletion: def.enabled ? (def.code === "north-america" ? 100 : 75) : 0,
      legalNoticeCount: 5,
    };
  });
}
