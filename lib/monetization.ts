// lib/monetization.ts

import { hasCapitalAccess } from "./level-guard";

/**
 * Determines whether the user can initiate payments or premium actions.
 * For now, only capital-access users may proceed.
 */
export function canInitiatePayment(userLevel: string): boolean {
  // Only advanced users can initiate monetized actions
  return hasCapitalAccess(userLevel as any);
}
