// lib/lib/kpi-types.ts
// Canonical internal KPI schema
// NOT exposed publicly

export type ThinkingLevel = 1 | 2 | 3 | 4 | 5;

export type PrimaryTrack =
  | "real_estate"
  | "paper_assets"
  | "business";

export type AgeRange =
  | "under_18"
  | "18_24"
  | "25_34"
  | "35_44"
  | "45_54"
  | "55_plus";

export type UserProfileKPI = {
  // Identity
  userId: string;
  createdAt: string;

  // Contact (internal only)
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country: string;
  region: string;

  // Demographic (non-sensitive)
  ageRange?: AgeRange;

  // Business intelligence
  hasBusiness: boolean;
  businessName?: string;
  businessJurisdiction?: string;
  businessFormalized?: boolean;

  // Financial cognition
  startingLevel: ThinkingLevel;
  currentLevel: ThinkingLevel;

  // Behavioral signal
  primaryTrackInterest: PrimaryTrack;
};
