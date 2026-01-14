import { PLANS } from "../plan";

/**
 * Canonical plan code type used everywhere
 */
export type PlanCode = keyof typeof PLANS;

/**
 * Full plan object type
 */
export type Plan = (typeof PLANS)[PlanCode];

/**
 * Re-export core data
 */
export { PLANS };
