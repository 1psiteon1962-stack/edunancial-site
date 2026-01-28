export type PlanCode = "free" | "starter" | "pro" | "growth" | "elite" | "enterprise";

export type UserProfile = {
  id: string;
  email: string;
  createdAt: string;
  plan: PlanCode;
};
