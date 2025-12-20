// lib/activation-engine.ts
// Hybrid activation model (Option C)
// Youth & Family = conservative gating
// Founder & Entrepreneur = progressive visibility

import { Level } from "./levels";
import { getLevelAccess } from "./level-access";
import { getRegionConfig } from "./regions";
import { getPricingForLevel } from "./pricing";

export type Persona =
  | "youth"
  | "family"
  | "founder"
  | "entrepreneur";

export interface ActivationContext {
  level: Level;
  persona: Persona;
  region: string;
  readinessScore?: number;
}

export interface ActivationResult {
  canAccessContent: boolean;
  canSeeLockedTiers: boolean;
  canUpgrade: boolean;
  pricing?: {
    currency: string;
    amount: number;
    interval?: string;
  };
  reason: string;
}

export function activateUser(
  context: ActivationContext
): ActivationResult {
  const { level, persona, region, readinessScore } = context;

  const regionConfig = getRegionConfig(region);
  const levelAccess = getLevelAccess(level);
  const pricing = getPricingForLevel(level, region);

  // Default behavior
  let canAccessContent = false;
  let canSeeLockedTiers = false;
  let canUpgrade = false;
  let reason = "Not evaluated";

  // Conservative personas
  if (persona === "youth" || persona === "family") {
    if (levelAccess.allowed && readinessScore !== undefined && readinessScore >= levelAccess.minReadiness) {
      canAccessContent = true;
      canUpgrade = levelAccess.upgradable;
      reason = "Readiness met for conservative path";
    } else {
      reason = "Readiness not met for conservative path";
    }
  }

  // Progressive personas
  if (persona === "founder" || persona === "entrepreneur") {
    canSeeLockedTiers = true;

    if (levelAccess.allowed) {
      canAccessContent = true;
      canUpgrade = levelAccess.upgradable;
      reason = "Progressive access granted";
    } else {
      reason = "Tier visible but locked";
    }
  }

  return {
    canAccessContent,
    canSeeLockedTiers,
    canUpgrade,
    pricing: canUpgrade
      ? {
          currency: regionConfig.currency,
          amount: pricing.amount,
          interval: pricing.interval,
        }
      : undefined,
    reason,
  };
}
