// lib/auth/session.ts

import type { PlanCode } from "../types/plan";

/**
 * SessionUser represents the authenticated user session.
 */
export interface SessionUser {
  id?: string;
  email?: string;
  planCode?: PlanCode | null;
}
