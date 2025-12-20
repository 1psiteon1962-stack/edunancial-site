// lib/level-guard.ts
import { Levels, LiteracyLevel } from "@/data/levels";

export function canAccessApp(
  userLevel: LiteracyLevel,
  appName: string
): boolean {
  const level = Levels[userLevel];
  return (
    level.allowedApps.includes("ALL") ||
    level.allowedApps.includes(appName)
  );
}

export function canPurchase(
  userLevel: LiteracyLevel,
  productKey: string
): boolean {
  const level = Levels[userLevel];
  return (
    level.allowedPurchases.includes("everything") ||
    level.allowedPurchases.includes(productKey)
  );
}

export function hasCapitalAccess(userLevel: LiteracyLevel): boolean {
  return Levels[userLevel].capitalAccess;
}
