// lib/activation-engine.ts

import { Level } from "./levels"
import { LevelAccess, getLevelAccess } from "./level-access"
import { getRegionConfig } from "./regions"
import { getPricingForLevel } from "./pricing"

export type ActivationResult = {
  level: Level
  region: string
  access: LevelAccess
  price: number
  currency: string
}

export function activateLevel(
  level: Level,
  regionCode: string
): ActivationResult {
  const access = getLevelAccess(level)
  const regionConfig = getRegionConfig(regionCode)
  const price = getPricingForLevel(level, regionConfig.code)

  return {
    level,
    region: regionConfig.code,
    access,
    price,
    currency: regionConfig.currency,
  }
}
