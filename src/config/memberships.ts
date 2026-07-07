// ======================================================
// EDUNANCIAL MEMBERSHIP CONFIGURATION
// FILE 1036
// VERSION 3.0
// ======================================================

export type MembershipTier =
  | "visitor"
  | "preview"
  | "learn"
  | "build"
  | "lead"
  | "enterprise";

export interface Membership {

  name: string;

  priceMonthly: number | null;

  priceAnnual: number | null;

  previewAllowed: boolean;

}

export const Memberships: Record<MembershipTier, Membership> = {

  visitor: {

    name: "Visitor",

    priceMonthly: 0,

    priceAnnual: 0,

    previewAllowed: true,

  },

  preview: {

    name: "Preview",

    priceMonthly: 0,

    priceAnnual: 0,

    previewAllowed: false,

  },

  learn: {

    name: "Learn",

    priceMonthly: 9.99,

    priceAnnual: 99,

    previewAllowed: false,

  },

  build: {

    name: "Build",

    priceMonthly: 39.99,

    priceAnnual: 399,

    previewAllowed: false,

  },

  lead: {

    name: "Lead",

    priceMonthly: 99.99,

    priceAnnual: 999,

    previewAllowed: false,

  },

  enterprise: {

    name: "Enterprise",

    priceMonthly: null,

    priceAnnual: null,

    previewAllowed: false,

  },

};

export const MembershipFeatures: Record<MembershipTier, string[]> = {

  visitor: [

    "Homepage",

    "Public Pages",

    "View Membership Options"

  ],

  preview: [

    "One Sample Lesson",

    "One Sample Assessment",

    "Limited Dashboard Preview"

  ],

  learn: [

    "Financial Literacy",

    "Financial Competency",

    "Learning Dashboard",

    "Progress Tracking",

    "Certificates",

    "Basic AI Coach"

  ],

  build: [

    "Everything in Learn",

    "Business Builder",

    "Business Courses",

    "Investment Courses",

    "Real Estate Courses",

    "Decision Labs",

    "Case Studies",

    "Business Health Dashboard",

    "Business AI"

  ],

  lead: [

    "Everything in Build",

    "Executive Dashboard",

    "Leadership AI",

    "Hiring AI",

    "Legal AI",

    "Tax AI",

    "International Expansion",

    "Advanced Analytics",

    "Market Intelligence"

  ],

  enterprise: [

    "Everything in Lead",

    "Organization Dashboard",

    "Organization Analytics",

    "Instructor Portal",

    "Multiple User Accounts",

    "Dedicated AI",

    "Priority Support",

    "Enterprise Reporting",

    "API Access"

  ]

};

export const SampleRules = {

  maximumSampleCourses: 1,

  maximumSampleAssessments: 1,

  allowRepeatSamples: false,

  requireAccountCreation: true,

  requireEmailVerification: true,

};

export function getMembershipFeatures(

  membership: MembershipTier

): string[] {

  return MembershipFeatures[membership];

}

export function isPreviewAllowed(

  membership: MembershipTier

): boolean {

  return Memberships[membership].previewAllowed;

}

// ======================================================
// END OF FILE
// ======================================================
