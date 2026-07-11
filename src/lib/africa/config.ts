// ======================================================
// AFRICA REGIONAL FOUNDATION
// config.ts – Region-level feature flags and settings
// PRIVATE by default – not publicly accessible until
// feature flag is explicitly enabled by founder.
// ======================================================

export const AFRICA_REGION_ID = "africa" as const;

/** Master switch: keeps the entire Africa region private. */
export const AFRICA_REGION_ENABLED = false;

/** Granular feature flags for controlled rollout. */
export interface AfricaFeatureFlags {
  /** Region is publicly visible. */
  regionPublic: boolean;
  /** Allow new member registrations from African countries. */
  memberRegistration: boolean;
  /** Enable marketplace for African sellers/buyers. */
  marketplace: boolean;
  /** Enable payments through African payment providers. */
  payments: boolean;
  /** Enable course catalogue in African languages. */
  courses: boolean;
  /** Enable startup-hub features for African founders. */
  startupHub: boolean;
  /** Enable funding-centre connections. */
  fundingCenter: boolean;
  /** Enable voice-AI in regional languages. */
  voiceAI: boolean;
  /** Expose the beta-tester access flow. */
  betaAccess: boolean;
  /** Enable tax / VAT calculation engine. */
  taxEngine: boolean;
  /** Enable SEO localisation for African country pages. */
  seoLocalization: boolean;
  /** Enable compliance-dashboard for country managers. */
  complianceDashboard: boolean;
}

export const AFRICA_FEATURE_FLAGS: AfricaFeatureFlags = {
  regionPublic: false,
  memberRegistration: false,
  marketplace: false,
  payments: false,
  courses: false,
  startupHub: false,
  fundingCenter: false,
  voiceAI: false,
  betaAccess: false,
  taxEngine: false,
  seoLocalization: false,
  complianceDashboard: false,
};

/** Returns true only when the region master switch AND the specific flag are on. */
export function isAfricaFeatureEnabled(
  flag: keyof AfricaFeatureFlags
): boolean {
  return AFRICA_REGION_ENABLED && AFRICA_FEATURE_FLAGS[flag];
}
