import { REGION_REGISTRY, type RegionCode } from "./engine";
import { getLegalText } from "./legalText";

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
    const def = REGION_REGISTRY[code];
    const legalPack = getLegalText(code);

    return {
      slug: def.code,
      name: def.name,
      enabled: def.enabled,
      supportedCurrencies: [...def.currencies],
      supportedLanguages: [...def.locales],
      status: def.enabled ? (def.code === "us" ? "active" : "beta") : "planned",
      translationCompletion: def.enabled ? (def.code === "us" ? 100 : 80) : 0,
      localizationCompletion: def.enabled ? (def.code === "us" ? 100 : 75) : 0,
      legalNoticeCount: Object.keys(legalPack).length,
    };
  });
}

