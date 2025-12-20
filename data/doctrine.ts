// data/doctrine.ts
// This file defines non-negotiable platform rules.
// It is intentionally not content-facing.

export const Doctrine = {
  mission: "Financial literacy before capital access.",
  positioning: {
    notEducation: true,
    notAdvice: true,
    notBrokerDealer: true,
  },
  principles: [
    "Structure before money",
    "Readiness before access",
    "Literacy before leverage",
    "Capital follows discipline",
  ],
  prohibitions: {
    noGuaranteedReturns: true,
    noSpeculationPromotion: true,
    noBypassOfLevels: true,
    noLocalAuthorityOverride: true,
  },
  authority: {
    primarySite: "US",
    mirrorsAreDistributionOnly: true,
    contentOrigin: "US",
    dataAggregation: "US",
  },
};
