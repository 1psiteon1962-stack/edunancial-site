/**
 * Role-based access control (RBAC) and scoped permission checks.
 *
 * Roles follow a hierarchical model:
 *   super_admin > admin > staff > member > guest
 *
 * Scopes follow a resource:action pattern, e.g. "courses:read", "billing:write".
 * Deny-by-default: operations require explicit allowance.
 */

import { ApiError } from "../api/errors";
import type { JwtClaims } from "./jwt";

// ─── Role hierarchy ───────────────────────────────────────────────────────────

export type Role =
  | "super_admin"
  | "admin"
  | "staff"
  | "instructor"
  | "member"
  | "guest";

const ROLE_RANK: Record<Role, number> = {
  super_admin: 100,
  admin: 80,
  staff: 60,
  instructor: 40,
  member: 20,
  guest: 0,
};

/**
 * Returns true if `role` has at least the rank of `required`.
 */
export function hasRole(role: Role, required: Role): boolean {
  return (ROLE_RANK[role] ?? -1) >= (ROLE_RANK[required] ?? 0);
}

/**
 * Returns the highest-ranked role from an array of role strings.
 */
export function highestRole(roles: string[]): Role {
  let best: Role = "guest";
  for (const r of roles) {
    if (r in ROLE_RANK && ROLE_RANK[r as Role] > ROLE_RANK[best]) {
      best = r as Role;
    }
  }
  return best;
}

// ─── Scope checks ─────────────────────────────────────────────────────────────

/**
 * Returns true when `granted` covers `required`.
 * Wildcard support: "courses:*" grants all courses actions; "*" grants everything.
 */
export function hasScope(granted: string[], required: string): boolean {
  if (granted.includes("*")) return true;
  if (granted.includes(required)) return true;
  const [resource] = required.split(":");
  return granted.includes(`${resource}:*`);
}

// ─── Predefined scope catalogue ───────────────────────────────────────────────

export const Scopes = {
  // Courses
  COURSES_READ: "courses:read",
  COURSES_WRITE: "courses:write",
  COURSES_DELETE: "courses:delete",

  // Billing
  BILLING_READ: "billing:read",
  BILLING_WRITE: "billing:write",

  // Users
  USERS_READ: "users:read",
  USERS_WRITE: "users:write",

  // Webhooks
  WEBHOOKS_READ: "webhooks:read",
  WEBHOOKS_WRITE: "webhooks:write",

  // Admin
  ADMIN_ALL: "admin:*",

  // API keys
  APIKEYS_MANAGE: "apikeys:manage",

  // Analytics
  ANALYTICS_READ: "analytics:read",
} as const;

// ─── Assertion helpers ────────────────────────────────────────────────────────

/**
 * Assert the JWT claims include at least the minimum required role.
 * Throws `ApiError` (forbidden) if the requirement is not met.
 */
export function requireRole(claims: JwtClaims, required: Role): void {
  const top = highestRole(claims.roles ?? []);
  if (!hasRole(top, required)) {
    throw ApiError.forbidden(
      `Requires role '${required}' or higher. Your highest role: '${top}'`
    );
  }
}

/**
 * Assert the JWT claims include the required scope.
 * Throws `ApiError` (forbidden) if the scope is missing.
 */
export function requireScope(claims: JwtClaims, scope: string): void {
  if (!hasScope(claims.scopes ?? [], scope)) {
    throw ApiError.forbidden(`Missing required scope: ${scope}`);
  }
}

/**
 * Assert either sufficient role OR scope (useful for service accounts that
 * present scopes but no roles).
 */
export function requireRoleOrScope(
  claims: JwtClaims,
  role: Role,
  scope: string
): void {
  const top = highestRole(claims.roles ?? []);
  const roleOk = hasRole(top, role);
  const scopeOk = hasScope(claims.scopes ?? [], scope);
  if (!roleOk && !scopeOk) {
    throw ApiError.forbidden(
      `Requires role '${role}' or scope '${scope}'`
    );
  }
}

// ─── Permission matrix (optional structured approach) ────────────────────────

export type Permission = {
  resource: string;
  action: "read" | "write" | "delete" | "manage";
};

export const defaultRolePermissions: Record<Role, Permission[]> = {
  super_admin: [{ resource: "*", action: "manage" }],
  admin: [
    { resource: "users", action: "manage" },
    { resource: "courses", action: "manage" },
    { resource: "billing", action: "manage" },
    { resource: "analytics", action: "read" },
  ],
  staff: [
    { resource: "courses", action: "write" },
    { resource: "users", action: "read" },
  ],
  instructor: [
    { resource: "courses", action: "write" },
    { resource: "courses", action: "read" },
  ],
  member: [
    { resource: "courses", action: "read" },
    { resource: "billing", action: "read" },
  ],
  guest: [],
};
