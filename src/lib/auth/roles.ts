export const AUTH_ROLES = [
  "administrator",
  "instructor",
  "enterprise",
  "premium",
  "free-member",
] as const;

export type AuthRole = (typeof AUTH_ROLES)[number];

const ROLE_WEIGHT: Record<AuthRole, number> = {
  "free-member": 1,
  premium: 2,
  instructor: 3,
  enterprise: 4,
  administrator: 5,
};

export function isAuthRole(value: string): value is AuthRole {
  return AUTH_ROLES.includes(value as AuthRole);
}

export function hasRequiredRole(
  role: AuthRole,
  minimumRole: AuthRole
): boolean {
  return ROLE_WEIGHT[role] >= ROLE_WEIGHT[minimumRole];
}

export function isAdministrator(role: AuthRole): boolean {
  return role === "administrator";
}
