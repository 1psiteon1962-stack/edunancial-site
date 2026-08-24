import type { BetaAccessSummary } from "@/lib/beta-access";

export type MembershipTier = "free" | "basic" | "premium" | "enterprise" | "beta";
export type SelfReportedGender = "female" | "male" | "nonbinary" | "self_described" | "prefer_not_to_say";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  membershipTier: MembershipTier;
  joinedDate: string;
  country: string;
  dateOfBirth?: string | null;
  gender?: SelfReportedGender | null;
  genderSelfDescription?: string | null;
  phone?: string | null;
  bio?: string | null;
  assessmentCompleted: boolean;
  overallScore: number | null;
  betaAccess?: BetaAccessSummary | null;
  emailVerified?: boolean;
  lastSignInAt?: string | null;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  dateOfBirth: string;
  gender?: SelfReportedGender | null;
  genderSelfDescription?: string | null;
}

export interface AuthResult { success: boolean; error?: string; }
export interface PasswordUpdateResult extends AuthResult {}
export interface SessionPayload { authenticated: boolean; user: AuthUser | null; csrfToken: string | null; }
