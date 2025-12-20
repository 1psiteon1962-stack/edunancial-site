// lib/access-control.ts
import { Level } from "./levels";

export type AccessRule = {
  requiredLevel: Level;
};

export function hasAccess(
  userLevel: Level,
  rule: AccessRule
): boolean {
  return userLevel >= rule.requiredLevel;
}
