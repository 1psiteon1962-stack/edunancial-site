// ======================================================
// AGENT AUTHORITY LEVELS
// GREEN  read approved data, draft into a review queue
// YELLOW write internal records no learner sees
// ORANGE propose a public or curriculum change (owner approval required)
// RED    human only: account restrictions, deletions, payments, publishing
// No agent may ever hold or perform a RED action.
// ======================================================

export type AuthorityLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED";

export type AgentMaxLevel = Exclude<AuthorityLevel, "RED">;

export const LEVEL_RANK: Readonly<Record<AuthorityLevel, number>> = Object.freeze({
  GREEN: 1,
  YELLOW: 2,
  ORANGE: 3,
  RED: 4,
});

export function isAuthorityLevel(value: unknown): value is AuthorityLevel {
  return value === "GREEN" || value === "YELLOW" || value === "ORANGE" || value === "RED";
}

/** True only when an agent at `agentMax` may perform an action that requires `required`. */
export function canPerform(agentMax: AuthorityLevel, required: AuthorityLevel): boolean {
  if (!isAuthorityLevel(agentMax) || !isAuthorityLevel(required)) return false;
  if (required === "RED" || agentMax === "RED") return false;
  return LEVEL_RANK[agentMax] >= LEVEL_RANK[required];
}

/** ORANGE actions always stop in the owner approval inbox. */
export function requiresOwnerApproval(required: AuthorityLevel): boolean {
  return required === "ORANGE" || required === "RED";
}
