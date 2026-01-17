// lib/kpi-types.ts
// Internal-only KPI and user intelligence schema

import type { ThinkingLevel } from "./diagnostic";
import type { RegionSlug, TrackKey } from "./content-registry";

export interface UserProfileKPI {
  userId: string;
  createdAt: string;

  // Identity
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  // Geography
  country: string;
  region: RegionSlug;

  // Age data (store AGE, not DOB)
  ageRange:
    | "under_18"
    | "18_24"
    | "25_34"
    | "35_44"
    | "45_54"
    | "55_64"
    | "65_plus";

  // Business intelligence
  hasBusiness: boolean;
  businessName?: string;
  businessJurisdiction?: string;
  businessFormalized?: boolean;

  // Economic behavior
  startingLevel: ThinkingLevel;
  currentLevel: ThinkingLevel;
  primaryTrackInterest: TrackKey;

  // Internal flags
  qualifiedForAdvanced?: boolean;
  investorCandidate?: boolean;
}
