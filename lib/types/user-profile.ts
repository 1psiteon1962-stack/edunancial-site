// lib/types/user-profile.ts

/**
 * Canonical user profile type used across the app.
 * THIS IS THE SINGLE SOURCE OF TRUTH.
 * Any file reading from `profile.hasBusiness` MUST be supported here.
 */

export type AgeRange =
  | "under_18"
  | "18_24"
  | "25_34"
  | "35_44"
  | "45_54"
  | "55_plus";

export type BusinessStatus =
  | "none"
  | "idea"
  | "registered"
  | "operating";

export interface UserProfile {
  /** Required */
  ageRange: AgeRange;
  country: string;
  createdAt: string;

  /** Business-related (used by SignupForm + normalize-profile) */
  hasBusiness: boolean;
  businessStatus?: BusinessStatus;

  /** Optional future expansion */
  industry?: string;
  revenueRange?: string;
}

/**
 * Normalized profile shape (if needed elsewhere)
 * Exported for reuse.
 */
export type NormalizedUserProfile = {
  ageRange: AgeRange;
  hasBusiness: boolean;
  businessStatus: BusinessStatus;
  country: string;
  createdAt: string;
};
