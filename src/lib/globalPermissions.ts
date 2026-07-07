export enum GlobalPermission {

  VIEW_GLOBAL_DASHBOARD="VIEW_GLOBAL_DASHBOARD",

  VIEW_REGION_DASHBOARD="VIEW_REGION_DASHBOARD",

  VIEW_COUNTRY_DASHBOARD="VIEW_COUNTRY_DASHBOARD",

  MANAGE_USERS="MANAGE_USERS",

  MANAGE_BOOKS="MANAGE_BOOKS",

  MANAGE_COURSES="MANAGE_COURSES",

  MANAGE_LANGUAGES="MANAGE_LANGUAGES",

  MANAGE_REGIONS="MANAGE_REGIONS",

  MANAGE_KPIS="MANAGE_KPIS",

  SYSTEM_ADMIN="SYSTEM_ADMIN"

}

  premium: {

    dashboard: true,

    assessments: true,

    learningPaths: true,

    courses: true,

    aiAccess: true,

    businessDashboard: true,

    analytics: true,

    organizationDashboard: false,

    executiveDashboard: false,

    founderDashboard: false,

    manageUsers: false,

    manageCountries: false,

    managePricing: false,

    manageMemberships: false,

    manageFeatureFlags: false,

  },

  instructor: {

    dashboard: true,

    assessments: true,

    learningPaths: true,

    courses: true,

    aiAccess: true,

    businessDashboard: true,

    analytics: true,

    organizationDashboard: false,

    executiveDashboard: false,

    founderDashboard: false,

    manageUsers: false,

    manageCountries: false,

    managePricing: false,

    manageMemberships: false,

    manageFeatureFlags: false,

  },

  support: {

    dashboard: true,

    assessments: false,

    learningPaths: false,

    courses: false,

    aiAccess: false,

    businessDashboard: false,

    analytics: false,

    organizationDashboard: false,

    executiveDashboard: false,

    founderDashboard: false,

    manageUsers: true,

    manageCountries: false,

    managePricing: false,

    manageMemberships: true,

    manageFeatureFlags: false,

  },

  organizationAdmin: {

    dashboard: true,

    assessments: true,

    learningPaths: true,

    courses: true,

    aiAccess: true,

    businessDashboard: true,

    analytics: true,

    organizationDashboard: true,

    executiveDashboard: false,

    founderDashboard: false,

    manageUsers: true,

    manageCountries: false,

    managePricing: false,

    manageMemberships: true,

    manageFeatureFlags: false,

  },

  countryManager: {

    dashboard: true,

    assessments: true,

    learningPaths: true,

    courses: true,

    aiAccess: true,

    businessDashboard: true,

    analytics: true,

    organizationDashboard: true,

    executiveDashboard: false,

    founderDashboard: false,

    manageUsers: true,

    manageCountries: true,

    managePricing: true,

    manageMemberships: true,

    manageFeatureFlags: true,

  },

  regionalDirector: {

    dashboard: true,

    assessments: true,

    learningPaths: true,

    courses: true,

    aiAccess: true,

    businessDashboard: true,

    analytics: true,

    organizationDashboard: true,

    executiveDashboard: true,

    founderDashboard: false,

    manageUsers: true,

    manageCountries: true,

    managePricing: true,

    manageMemberships: true,

    manageFeatureFlags: true,

  },

  executive: {

    dashboard: true,

    assessments: true,

    learningPaths: true,

    courses: true,

    aiAccess: true,

    businessDashboard: true,

    analytics: true,

    organizationDashboard: true,

    executiveDashboard: true,

    founderDashboard: false,

    manageUsers: true,

    manageCountries: true,

    managePricing: true,

    manageMemberships: true,

    manageFeatureFlags: true,

  },

  founder: {

    dashboard: true,

    assessments: true,

    learningPaths: true,

    courses: true,

    aiAccess: true,

    businessDashboard: true,

    analytics: true,

    organizationDashboard: true,

    executiveDashboard: true,

    founderDashboard: true,

    manageUsers: true,

    manageCountries: true,

    managePricing: true,

    manageMemberships: true,

    manageFeatureFlags: true
     

  },

};

// ======================================================
// PERMISSION HELPERS
// ======================================================

export function getPermissions(role: UserRole): PermissionSet {

  return DefaultPermissions[role];

}

export function hasPermission(

  role: UserRole,

  permission: keyof PermissionSet

): boolean {

  return DefaultPermissions[role][permission];

}

export function canAccessDashboard(role: UserRole): boolean {

  return hasPermission(role, "dashboard");

}

export function canUseAI(role: UserRole): boolean {

  return hasPermission(role, "aiAccess");

}

export function canManageUsers(role: UserRole): boolean {

  return hasPermission(role, "manageUsers");

}

export function canManagePricing(role: UserRole): boolean {

  return hasPermission(role, "managePricing");

}

export function canManageCountries(role: UserRole): boolean {

  return hasPermission(role, "manageCountries");

}

export function canAccessFounderDashboard(role: UserRole): boolean {

  return hasPermission(role, "founderDashboard");

}

export function canAccessExecutiveDashboard(role: UserRole): boolean {

  return hasPermission(role, "executiveDashboard");

}

export function canManageMemberships(role: UserRole): boolean {

  return hasPermission(role, "manageMemberships");

}

export function canManageFeatureFlags(role: UserRole): boolean {

  return hasPermission(role, "manageFeatureFlags");

}
      
