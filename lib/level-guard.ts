// lib/level-guard.ts

/**
 * Level guard utilities.
 * Fixes Netlify build error:
 * Module '"./level-guard"' has no exported member 'hasCapitalAccess'.
 */

/**
 * Capital access gate used by monetization rules.
 * Assumes user levels are numeric (e.g., 1–5).
 * Capital access typically starts at Level 4+.
 */
export function hasCapitalAccess(userLevel: number): boolean {
  return Number.isFinite(userLevel) && userLevel >= 4;
}

/**
 * Compatibility alias (prevents future naming mismatches).
 */
export const hasCapitalLevel = hasCapitalAccess;
