// lib/auth/types.ts

export type PlanCode =
  | "starter"
  | "builder"
  | "pro"
  | "elite"
  | "founder";

export interface UserSession {
  userId?: string | null;
  email?: string | null;
  isAdmin?: boolean;

  // ✅ REQUIRED FIX:
  // AccessGate + useUser hook expect plan to exist
  plan?: PlanCode | null;
}
