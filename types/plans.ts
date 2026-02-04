// types/plan.ts

/**
 * Alias compatibility shim.
 *
 * Many parts of the codebase still import:
 *
 *   import type { PlanCode } from "@/types/plan";
 *
 * Netlify/Linux builds require this exact module path to exist.
 *
 * This file re-exports the canonical PlanCode type from lib/types.
 */

export type { PlanCode } from "../lib/types/plan";
