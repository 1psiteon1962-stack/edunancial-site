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

  "north-america": {
    enabled: true,
    phase: "live",
  },

  caribbean: {
    enabled: true,
    phase: "pilot",
  },

  "latin-america": {
    enabled: true,
    phase: "pilot",
  },

  "western-europe": {
    enabled: true,
    phase: "pilot",
  },

  "europe-2a": {
    enabled: true,
    phase: "pilot",
  },

  "eastern-europe": {
    enabled: true,
    phase: "pilot",
  },

  "europe-2b": {
    enabled: true,
    phase: "pilot",
  },

  "east-africa": {
    enabled: true,
    phase: "pilot",
  },

  "west-africa": {
    enabled: true,
    phase: "pilot",
  },

  "latin-america-2a": {
    enabled: true,
    phase: "pilot",
  },

  "latin-america-2b": {
    enabled: true,
    phase: "pilot",
  },

  "southern-africa": {
    enabled: true,
    phase: "pilot",
  },

  "middle-east": {
    enabled: true,
    phase: "pilot",
  },

  mena: {
    enabled: true,
    phase: "pilot",
  },

  africa: {
    enabled: true,
    phase: "pilot",
  },

  europe: {
    enabled: true,
    phase: "pilot",
  },

  "asia-pacific": {
    enabled: true,
    phase: "planned",
  },

  asia: {
    enabled: true,
    phase: "planned",
  },

  "asia-emerging": {
    enabled: false,
    phase: "planned",
  },

  oceania: {
    enabled: true,
    phase: "planned",
  },
};
