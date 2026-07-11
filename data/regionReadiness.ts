export const REGION_READINESS: Record<
  string,
  {
    enabled: boolean;
    phase: "live" | "pilot" | "planned";
    rollout?: {
      founderOnly: boolean;
      betaTestersEnabled: boolean;
      featureFlags: Record<string, boolean>;
    };
  }
> = {
  us: {
    enabled: true,
    phase: "live",
    rollout: {
      founderOnly: false,
      betaTestersEnabled: false,
      featureFlags: {},
    },
  },

  mena: {
    enabled: true,
    phase: "pilot",
  },

  europe: {
    enabled: true,
    phase: "pilot",
  },

  "asia-pacific": {
    enabled: false,
    phase: "planned",
    rollout: {
      founderOnly: true,
      betaTestersEnabled: false,
      featureFlags: {
        APAC_FOUNDATION_PRIVATE: false,
        APAC_BETA_ACCESS: false,
        APAC_PUBLIC_ROLLOUT: false,
      },
    },
  },

  "asia-emerging": {
    enabled: false,
    phase: "planned",
  },

  caribbean: {
    enabled: true,
    phase: "pilot",
  },
};
