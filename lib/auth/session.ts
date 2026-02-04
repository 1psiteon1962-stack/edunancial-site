// lib/auth/session.ts

import type { PlanCode } from "../types/plan";

/**
 * UserSession is the full session object used by useSession().
 * This MUST be exported because lib/auth/useSession.ts imports it.
 */
export type UserSession = {
  id?: string;
  email?: string;
  planCode?: PlanCode | null;
};

/**
 * SessionUser is a lightweight alias (kept for compatibility).
 */
export interface SessionUser extends UserSession {}
