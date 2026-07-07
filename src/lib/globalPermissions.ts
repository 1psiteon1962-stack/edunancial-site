// ======================================================
// GLOBAL PERMISSIONS
// FILE 1040
// VERSION 3.0
// ======================================================

export enum GlobalPermission {
  VIEW_GLOBAL_DASHBOARD = "VIEW_GLOBAL_DASHBOARD",
  VIEW_REGION_DASHBOARD = "VIEW_REGION_DASHBOARD",
  VIEW_COUNTRY_DASHBOARD = "VIEW_COUNTRY_DASHBOARD",

  MANAGE_USERS = "MANAGE_USERS",
  MANAGE_BOOKS = "MANAGE_BOOKS",
  MANAGE_COURSES = "MANAGE_COURSES",
  MANAGE_LANGUAGES = "MANAGE_LANGUAGES",
  MANAGE_REGIONS = "MANAGE_REGIONS",
  MANAGE_KPIS = "MANAGE_KPIS",

  SYSTEM_ADMIN = "SYSTEM_ADMIN",
}

export type GlobalRole =
  | "guest"
  | "visitor"
  | "member"
  | "premium"
  | "instructor"
  | "support"
  | "organizationAdmin"
  | "countryManager"
  | "regionalDirector"
  | "executive"
  | "founder";

export const GlobalRolePermissions: Record<GlobalRole, GlobalPermission[]> = {

  guest: [],

  visitor: [],

  member: [],

  premium: [
    GlobalPermission.VIEW_COUNTRY_DASHBOARD,
  ],

  instructor: [
    GlobalPermission.MANAGE_COURSES,
  ],

  support: [
    GlobalPermission.MANAGE_USERS,
  ],

  organizationAdmin: [
    GlobalPermission.MANAGE_USERS,
    GlobalPermission.MANAGE_COURSES,
  ],

  countryManager: [
    GlobalPermission.VIEW_COUNTRY_DASHBOARD,
    GlobalPermission.MANAGE_USERS,
    GlobalPermission.MANAGE_BOOKS,
    GlobalPermission.MANAGE_COURSES,
    GlobalPermission.MANAGE_LANGUAGES,
    GlobalPermission.MANAGE_KPIS,
  ],

  regionalDirector: [
    GlobalPermission.VIEW_COUNTRY_DASHBOARD,
    GlobalPermission.VIEW_REGION_DASHBOARD,
    GlobalPermission.MANAGE_USERS,
    GlobalPermission.MANAGE_BOOKS,
    GlobalPermission.MANAGE_COURSES,
    GlobalPermission.MANAGE_LANGUAGES,
    GlobalPermission.MANAGE_REGIONS,
    GlobalPermission.MANAGE_KPIS,
  ],

  executive: [
    GlobalPermission.VIEW_COUNTRY_DASHBOARD,
    GlobalPermission.VIEW_REGION_DASHBOARD,
    GlobalPermission.VIEW_GLOBAL_DASHBOARD,
    GlobalPermission.MANAGE_USERS,
    GlobalPermission.MANAGE_BOOKS,
    GlobalPermission.MANAGE_COURSES,
    GlobalPermission.MANAGE_LANGUAGES,
    GlobalPermission.MANAGE_REGIONS,
    GlobalPermission.MANAGE_KPIS,
  ],

  founder: [
    GlobalPermission.VIEW_GLOBAL_DASHBOARD,
    GlobalPermission.VIEW_REGION_DASHBOARD,
    GlobalPermission.VIEW_COUNTRY_DASHBOARD,
    GlobalPermission.MANAGE_USERS,
    GlobalPermission.MANAGE_BOOKS,
    GlobalPermission.MANAGE_COURSES,
    GlobalPermission.MANAGE_LANGUAGES,
    GlobalPermission.MANAGE_REGIONS,
    GlobalPermission.MANAGE_KPIS,
    GlobalPermission.SYSTEM_ADMIN,
  ],

};

export function hasGlobalPermission(
  role: GlobalRole,
  permission: GlobalPermission
): boolean {
  return GlobalRolePermissions[role].includes(permission);
}

// ======================================================
// END OF FILE
// ======================================================
