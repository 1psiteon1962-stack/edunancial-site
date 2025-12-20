// lib/monetization.ts
import { hasCapitalAccess } from "./level-guard";

export function canInitiatePayment(
  userLevel: number,
  region: string
): boolean {
  if (!hasCapitalAccess(userLevel as any)) return false;

  // Region-specific logic can be expanded later
  return ["US", "AFRICA", "ASIA"].includes(region);
}
