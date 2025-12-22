// lib/regions.ts

export type Region = {
  code: string
  currency: string
  locale: string
}

const REGIONS: Record<string, Region> = {
  US: { code: "US", currency: "USD", locale: "en-US" },
  PR: { code: "PR", currency: "USD", locale: "es-PR" },
  DR: { code: "DR", currency: "DOP", locale: "es-DO" },
  MX: { code: "MX", currency: "MXN", locale: "es-MX" },
  ES: { code: "ES", currency: "EUR", locale: "es-ES" },
}

export function resolveRegion(input?: string): Region {
  if (!input) return REGIONS.US
  const key = input.toUpperCase()
  return REGIONS[key] ?? REGIONS.US
}

export function getRegionConfig(regionCode?: string): Region {
  return resolveRegion(regionCode)
}
