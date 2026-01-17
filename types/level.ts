// types/level.ts

/**
 * Plan levels required for gated access
 */
export type RequiredPlan =
  | "free"
  | "starter"
  | "pro"
  | "enterprise";

/**
 * Canonical level definition
 * Used by:
 * - data/us/levels.ts
 * - app/(regions)/us/level-* pages
 * - AccessGate
 */
export interface LevelDefinition {
  /**
   * Stable unique identifier (used in data + routing)
   */
  id: string;

  /**
   * Public-facing level code (e.g. "level-1")
   */
  code: string;

  /**
   * Display title
   */
  title: string;

  /**
   * Short marketing line
   */
  tagline?: string;

  /**
   * Main description paragraph
   */
  description?: string;

  /**
   * Required plan(s) to access this level
   * - undefined or "free" = public
   */
  requires?: RequiredPlan | RequiredPlan[];

  /**
   * Optional learning or business outcomes
   */
  outcomes?: string[];
}
