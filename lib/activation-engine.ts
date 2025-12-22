// lib/activation-engine.ts

import { Level } from "./levels"
import { getLevelAccess } from "./level-access"
import { getRegionConfig } from "./regions"
import { getPricingForLevel } from "./pricing"

export type ActivationResult = {
  level: Level
  region: string
  access: string
  price: number
  currency: string
}

export function activateLevel(
  level: Level,
  region: string
): ActivationResult {
  const access = getLevelAccess(level)
  const regionConfig = getRegionConfig(region)
  const price = getPricingForLevel(level, regionConfig.code)

  return {
    level,
    region: regionConfig.code,
    access,
    price,
    currency: regionConfig.currency,
  }
}
