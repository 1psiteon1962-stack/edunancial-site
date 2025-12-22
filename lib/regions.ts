// lib/regions.ts

export type RegionConfig = {
  code: string
  currency: string
  locale: string
  taxRate: number
}

export const REGION_CONFIG: Record<string, RegionConfig> = {
  US: { code: "US", currency: "USD", locale: "en-US", taxRate: 0 },
  PR: { code: "PR", currency: "USD", locale: "es-PR", taxRate: 0 },
  DR: { code: "DR", currency: "DOP", locale: "es-DO", taxRate: 0.18 },
  LATAM: { code: "LATAM", currency: "USD", locale: "es-419", taxRate: 0.15 },
  EU: { code: "EU", currency: "EUR", locale: "en-GB", taxRate: 0.2 },
}

export function getRegionConfig(region: string): RegionConfig {
  return REGION_CONFIG[region] ?? REGION_CONFIG.US
}
