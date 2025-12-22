// lib/activation-engine.ts

import { Level } from "./levels"
import { getLevelAccess } from "./level-access"
import { getRegionConfig } from "./regions"
import { getPricingForLevel } from "./pricing"

export type ActivationResult = {
  level: Level
  access: ReturnType<typeof getLevelAccess>
  pricing: ReturnType<typeof getPricingForLevel>
  region: ReturnType<typeof getRegionConfig>
}

export function activateUser(
  level: Level,
  regionCode: string
): ActivationResult {
  return {
    level,
    access: getLevelAccess(level),
    pricing: getPricingForLevel(level),
    region: getRegionConfig(regionCode),
  }
}
