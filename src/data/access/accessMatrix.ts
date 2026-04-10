export type PlanCode =
  | "free"
  | "starter"
  | "builder"
  | "operator"
  | "owner"
  | "investor";

export type AccessArea =
  | "content"
  | "tools"
  | "live"
  | "admin";

export const ACCESS_MATRIX: Record<PlanCode, AccessArea[]> = {
  free: ["content"],
  starter: ["content", "tools"],
  builder: ["content", "tools", "live"],
  operator: ["content", "tools", "live"],
  owner: ["content", "tools", "live"],
  investor: ["content", "tools", "live", "admin"],
};
