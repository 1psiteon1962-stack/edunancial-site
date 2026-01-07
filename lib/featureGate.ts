import { FEATURE_FLAGS, FeatureFlag } from "./featureFlags";

/**
 * Centralized feature gate.
 * No branching logic elsewhere.
 */

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return Boolean(FEATURE_FLAGS[flag]);
}
