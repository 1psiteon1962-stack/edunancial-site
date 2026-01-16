import type { PlanCode } from "@/types/plan";

export interface UserSession {
  userId: string;
  email: string;
  plan: PlanCode;
}
