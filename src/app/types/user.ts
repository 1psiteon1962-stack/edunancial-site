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

// ======================================================
// USER PROFILE EXTENSIONS
// FILE 1035
// PART 2
// ======================================================

export interface UserGoals {

  buildBusiness: boolean;

  investMoney: boolean;

  improveCredit: boolean;

  buyRealEstate: boolean;

  reduceDebt: boolean;

  increaseCashFlow: boolean;

  retireEarly: boolean;

  internationalExpansion: boolean;

}

export interface UserProgress {

  financialLiteracyScore: number;

  financialCompetencyScore: number;

  businessHealthScore: number;

  aiReadinessScore: number;

  investingScore: number;

  realEstateScore: number;

  leadershipScore: number;

  completedCourses: number;

  completedLessons: number;

  completedAssessments: number;

  completedDecisionLabs: number;

  completedCaseStudies: number;

}

export interface UserSecurity {

  pinEnabled: boolean;

  pinLastChanged: string;

  twoFactorEnabled: boolean;

  trustedDevices: number;

  failedLoginAttempts: number;

  accountLocked: boolean;

}
