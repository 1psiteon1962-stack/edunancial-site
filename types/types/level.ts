// types/level.ts

/**
 * Canonical level definition used by:
 * - data/us/levels.ts
 * - AccessGate
 * - Level-based routing
 *
 * This file MUST exist for Netlify / Linux builds.
 */

export interface LevelDefinition {
  id: string;
  name: string;
  description: string;

  /**
   * Minimum plan required to access this level.
   * Keep as string to avoid circular imports.
   * Example values: "free", "starter", "basic", "pro", "enterprise"
   */
  requiredPlan?: string;
}
