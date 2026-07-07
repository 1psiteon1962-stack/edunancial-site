// ======================================================
// EDUNANCIAL USER CORE TYPES
// FILE 1035
// PART 1
// ======================================================

export type MembershipLevel =
  | "visitor"
  | "preview"
  | "learn"
  | "build"
  | "lead"
  | "enterprise";

export type UserRole =
  | "guest"
  | "member"
  | "premium"
  | "instructor"
  | "support"
  | "organizationAdmin"
  | "countryManager"
  | "regionalDirector"
  | "executive"
  | "founder";

export interface UserProfile {

  id: string;

  firstName: string;

  lastName: string;

  email: string;

  country: string;

  stateProvince: string;

  city: string;

  language: string;

  currency: string;

  timezone: string;

  membership: MembershipLevel;

  role: UserRole;

  pinEnabled: boolean;

  twoFactorEnabled: boolean;

  createdAt: string;

  lastLogin: string;

}
