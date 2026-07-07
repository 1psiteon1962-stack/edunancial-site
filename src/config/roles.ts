// ======================================================
// EDUNANCIAL ROLE CONFIGURATION
// FILE 1037
// VERSION 1.0
// ======================================================

export type UserRole =
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

export const Roles = [

  "guest",

  "visitor",

  "member",

  "premium",

  "instructor",

  "support",

  "organizationAdmin",

  "countryManager",

  "regionalDirector",

  "executive",

  "founder",

];

export const RoleDescriptions = {

  guest: "Not logged in.",

  visitor: "Registered but using preview content.",

  member: "Standard paid member.",

  premium: "Advanced member with expanded access.",

  instructor: "Creates and manages educational content.",

  support: "Customer support representative.",

  organizationAdmin: "Manages an organization's users.",

  countryManager: "Manages one country's operations.",

  regionalDirector: "Manages multiple countries.",

  executive: "Corporate executive access.",

  founder: "Complete unrestricted platform access.",

};

export const FounderRole = "founder";

export const ExecutiveRoles = [

  "executive",

  "founder",

];

export const StaffRoles = [

  "support",

  "instructor",

  "organizationAdmin",

  "countryManager",

  "regionalDirector",

  "executive",

  "founder",

];

// ======================================================
// END OF FILE
// ======================================================
