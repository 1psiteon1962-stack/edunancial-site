import type { AdminRole, Permission, RoleConfig } from "./types";

// Every distinct resource that can be permission-gated across the admin portal.
const ALL_RESOURCES = [
  "dashboard",
  "analytics",
  "users",
  "roles",
  "courses",
  "cms",
  "media",
  "memberships",
  "pricing",
  "email-campaigns",
  "leads",
  "kpi",
  "reports",
  "config",
  "audit",
] as const;

const ALL_ACTIONS: Permission["action"][] = [
  "view",
  "create",
  "edit",
  "delete",
  "export",
  "manage",
];

function fullAccess(resources: readonly string[] = ALL_RESOURCES): Permission[] {
  return resources.flatMap((resource) =>
    ALL_ACTIONS.map((action) => ({ action, resource }))
  );
}

function viewExport(resources: readonly string[]): Permission[] {
  return resources.flatMap((resource) => [
    { action: "view" as const, resource },
    { action: "export" as const, resource },
  ]);
}

function crud(resources: readonly string[], includeDelete = false): Permission[] {
  const actions: Permission["action"][] = includeDelete
    ? ["view", "create", "edit", "delete"]
    : ["view", "create", "edit"];
  return resources.flatMap((resource) =>
    actions.map((action) => ({ action, resource }))
  );
}

export const ROLE_CONFIGS: RoleConfig[] = [
  {
    role: "super_admin",
    label: "Super Admin",
    description: "Full unrestricted access to every module, resource, and setting in the admin portal.",
    color: "text-red-400 border-red-500/40 bg-red-500/10",
    permissions: fullAccess(),
  },
  {
    role: "admin",
    label: "Administrator",
    description: "Broad operational access to manage users, content, and commerce, excluding system-level configuration.",
    color: "text-blue-400 border-blue-500/40 bg-blue-500/10",
    permissions: [
      ...fullAccess(["users", "courses", "cms", "media", "memberships", "pricing", "email-campaigns", "leads"]),
      ...viewExport(["dashboard", "analytics", "kpi", "reports", "audit"]),
      { action: "view", resource: "roles" },
      { action: "view", resource: "config" },
    ],
  },
  {
    role: "content_manager",
    label: "Content Manager",
    description: "Manages courses, CMS pages, and media assets. Cannot manage users or billing.",
    color: "text-green-400 border-green-500/40 bg-green-500/10",
    permissions: [
      ...crud(["courses", "cms", "media"], true),
      ...viewExport(["dashboard", "analytics"]),
      { action: "view", resource: "leads" },
    ],
  },
  {
    role: "instructor",
    label: "Instructor",
    description: "Manages assigned courses and lesson content, with read-only visibility into enrollments.",
    color: "text-purple-400 border-purple-500/40 bg-purple-500/10",
    permissions: [
      ...crud(["courses"]),
      { action: "view", resource: "media" },
      { action: "view", resource: "dashboard" },
      { action: "view", resource: "users" },
    ],
  },
  {
    role: "support",
    label: "Support",
    description: "Handles member support requests: can view and edit user accounts but not billing or content.",
    color: "text-orange-400 border-orange-500/40 bg-orange-500/10",
    permissions: [
      { action: "view", resource: "users" },
      { action: "edit", resource: "users" },
      { action: "view", resource: "dashboard" },
      { action: "view", resource: "memberships" },
      { action: "view", resource: "audit" },
    ],
  },
  {
    role: "marketing",
    label: "Marketing",
    description: "Manages email campaigns, lead capture, and marketing reporting.",
    color: "text-pink-400 border-pink-500/40 bg-pink-500/10",
    permissions: [
      ...crud(["email-campaigns", "leads"], true),
      ...viewExport(["dashboard", "analytics", "reports", "kpi"]),
      { action: "view", resource: "cms" },
    ],
  },
  {
    role: "analyst",
    label: "Analyst",
    description: "Read-only access to dashboards, analytics, and exportable reports across the platform.",
    color: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
    permissions: viewExport(ALL_RESOURCES),
  },
];

export function getRoleConfig(role: AdminRole): RoleConfig {
  const config = ROLE_CONFIGS.find((r) => r.role === role);
  if (!config) {
    throw new Error(`Unknown admin role: ${role}`);
  }
  return config;
}

export function hasPermission(
  role: AdminRole,
  action: Permission["action"],
  resource: string
): boolean {
  const config = getRoleConfig(role);
  return config.permissions.some(
    (permission) => permission.action === action && permission.resource === resource
  );
}

export { ALL_RESOURCES, ALL_ACTIONS };
