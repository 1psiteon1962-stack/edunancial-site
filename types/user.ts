// types/user.ts

export type PlanCode =
  | "free"
  | "starter"
  | "builder"
  | "wealth"
  | "empire"
  | "architect";

export interface UserProfile {
  userId: string;

  /** Optional metadata */
  createdAt?: Date;

  /** Basic identity */
  firstName: string;
  lastName: string;

  /** Contact */
  email?: string;

  /** Monetization tier */
  plan?: PlanCode;

  /** KPI / usage tracking */
  lastActiveAt?: Date;
}
