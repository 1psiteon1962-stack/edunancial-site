export const REGION_READINESS: Record<
  string,
  {
    enabled: boolean;
    phase: "live" | "pilot" | "planned";
  }
> = {
  us: {
    enabled: true,
    phase: "live",
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
