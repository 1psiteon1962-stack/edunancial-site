/**
 * Role-Based Access Control (RBAC) — Edunancial
 *
 * Roles (from highest to lowest privilege):
 *   owner       — Super administrator. Bypasses all paywalls and restrictions.
 *   admin       — Administrator. Full access except owner-only operations.
 *   editor      — Can create, edit, publish/unpublish, and archive content.
 *   instructor  — Can create and edit their own courses/lessons (draft only).
 *   member      — Paying member. Access governed by their membership tier.
 *   guest       — Unauthenticated or free-tier user with no content access.
 */

import type { AdminRole } from "@/lib/admin-content/types";

export type { AdminRole };

/**
 * All discrete permissions in the system.
 */
export type Permission =
  // Admin portal access
  | "admin:access"
  // Content operations
  | "content:view_all"      // bypass paywalls — access every lesson regardless of tier
  | "content:create"        // create new courses, modules, lessons
  | "content:edit"          // edit existing content
  | "content:publish"       // publish / unpublish lessons and courses
  | "content:archive"       // archive lessons and courses
  | "content:delete"        // permanently delete content
  // Track management
  | "tracks:manage"         // create / rename / archive course tracks
  // User and role management
  | "users:view"            // view user list
  | "users:manage"          // promote / demote users, assign roles
  // Membership management
  | "memberships:manage"    // create / edit / cancel membership plans
  // Analytics and reporting
  | "analytics:view"        // view platform analytics and KPIs
  // System settings
  | "system:access"         // access system-level settings and diagnostics
  // Owner-only superpower
  | "owner:only";           // reserved exclusively for the owner role

/**
 * Permission matrix — every role maps to a set of granted permissions.
 * The `owner` role implicitly holds all permissions (enforced by `hasPermission`).
 */
const ROLE_PERMISSIONS: Record<AdminRole, ReadonlySet<Permission>> = {
  owner: new Set<Permission>([
    "admin:access",
    "content:view_all",
    "content:create",
    "content:edit",
    "content:publish",
    "content:archive",
    "content:delete",
    "tracks:manage",
    "users:view",
    "users:manage",
    "memberships:manage",
    "analytics:view",
    "system:access",
    "owner:only",
  ]),
  admin: new Set<Permission>([
    "admin:access",
    "content:view_all",
    "content:create",
    "content:edit",
    "content:publish",
    "content:archive",
    "content:delete",
    "tracks:manage",
    "users:view",
    "users:manage",
    "memberships:manage",
    "analytics:view",
    "system:access",
  ]),
  editor: new Set<Permission>([
    "admin:access",
    "content:view_all",
    "content:create",
    "content:edit",
    "content:publish",
    "content:archive",
  ]),
  instructor: new Set<Permission>([
    "admin:access",
    "content:view_all",
    "content:create",
    "content:edit",
  ]),
  member: new Set<Permission>([
    // Members do NOT bypass paywalls here — their tier controls access
    // via the membership-tier system in the member auth context.
  ]),
  guest: new Set<Permission>([]),
};

/**
 * Returns true if the given role has the requested permission.
 */
export function hasPermission(role: AdminRole, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[role] as Set<Permission>).has(permission);
}

/**
 * Returns true if the given role has at least one of the requested permissions.
 */
export function hasAnyPermission(role: AdminRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Returns true if the given role is among the allowed roles.
 */
export function hasRole(role: AdminRole, allowedRoles: AdminRole[]): boolean {
  return allowedRoles.includes(role);
}

/**
 * Returns true for any role that can access the admin portal.
 */
export function isAdminRole(role: AdminRole): boolean {
  return hasPermission(role, "admin:access");
}

/**
 * Returns true for roles that bypass all member paywalls.
 */
export function bypassesPaywall(role: AdminRole): boolean {
  return hasPermission(role, "content:view_all");
}

/**
 * Returns the ordered list of all roles (highest privilege first).
 */
export const ALL_ROLES: readonly AdminRole[] = [
  "owner",
  "admin",
  "editor",
  "instructor",
  "member",
  "guest",
] as const;

/**
 * Human-readable labels for each role.
 */
export const ROLE_LABELS: Record<AdminRole, string> = {
  owner: "Owner (Super Administrator)",
  admin: "Administrator",
  editor: "Editor",
  instructor: "Instructor",
  member: "Member",
  guest: "Guest",
};

/**
 * Roles that are permitted to sign in to the admin portal.
 */
export const ADMIN_PORTAL_ROLES: readonly AdminRole[] = [
  "owner",
  "admin",
  "editor",
  "instructor",
] as const;
