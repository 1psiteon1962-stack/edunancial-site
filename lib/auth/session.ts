import type { PlanCode } from "@/types/plan";

export interface SessionUser {
  planCode?: PlanCode | null;
}

export interface UserSession {
  user?: SessionUser | null;
}
