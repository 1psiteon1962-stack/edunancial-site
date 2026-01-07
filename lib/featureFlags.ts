/**
 * Global feature flags.
 * Safe, static, additive-only configuration.
 * No runtime side effects.
 */

export type FeatureFlag =
  | "ENABLE_CARIBBEAN"
  | "ENABLE_LATAM"
  | "ENABLE_AFRICA"
  | "ENABLE_CUBA_TRANSITION"
  | "ENABLE_MULTILINGUAL"
  | "ENABLE_ADMIN_PANEL";

export const FEATURE_FLAGS: Record<FeatureFlag, boolean> = {
  ENABLE_CARIBBEAN: true,
  ENABLE_LATAM: true,
  ENABLE_AFRICA: true,
  ENABLE_CUBA_TRANSITION: false, // intentionally OFF until political trigger
  ENABLE_MULTILINGUAL: true,
  ENABLE_ADMIN_PANEL: false,
};
