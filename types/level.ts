// types/level.ts

import type { PlanTier } from "./plan";

export type LevelCode = "L1" | "L2" | "L3" | "L4" | "L5";

/**
 * Canonical level shape used across data + pages.
 * - `code` is referenced by pages (e.g., lvl.code)
 * - `title` is referenced by pages (e.g., lvl.title)
 */
export type LevelDefinition = {
  code: LevelCode;
  title: string;
  description?: string;
  requires?: PlanTier;
};

/**
 * Backwards-compat alias for older imports that expect `LevelSpec`.
 */
export type LevelSpec = LevelDefinition;
