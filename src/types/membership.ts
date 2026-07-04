export type MembershipTier =
  | "free"
  | "basic"
  | "premium"
  | "enterprise";

export interface MembershipPlan {

  id: MembershipTier;

  name: string;

  monthlyPrice: number;

  annualPrice: number;

  currency: string;

  featured: boolean;

  assessmentIncluded: boolean;

  marketplaceIncluded: boolean;

  aiCoachIncluded: boolean;

  downloadableCourses: boolean;

  prioritySupport: boolean;

  maxCertificates: number;

}

export const membershipPlans: MembershipPlan[] = [

  {
    id: "free",
    name: "Free",

    monthlyPrice: 0,
    annualPrice: 0,

    currency: "USD",

    featured: false,

    assessmentIncluded: false,
    marketplaceIncluded: false,
    aiCoachIncluded: false,
    downloadableCourses: false,
    prioritySupport: false,

    maxCertificates: 0,
  },

  {
    id: "basic",
    name: "Basic",

    monthlyPrice: 19,
    annualPrice: 199,

    currency: "USD",

    featured: true,

    assessmentIncluded: true,
    marketplaceIncluded: true,
    aiCoachIncluded: false,
    downloadableCourses: true,
    prioritySupport: false,

    maxCertificates: 10,
  },

  {
    id: "premium",
    name: "Premium",

    monthlyPrice: 49,
    annualPrice: 499,

    currency: "USD",

    featured: false,

    assessmentIncluded: true,
    marketplaceIncluded: true,
    aiCoachIncluded: true,
    downloadableCourses: true,
    prioritySupport: true,

    maxCertificates: 999,
  },

  {
    id: "enterprise",
    name: "Enterprise",

    monthlyPrice: 0,
    annualPrice: 0,

    currency: "USD",

    featured: false,

    assessmentIncluded: true,
    marketplaceIncluded: true,
    aiCoachIncluded: true,
    downloadableCourses: true,
    prioritySupport: true,

    maxCertificates: 999999,
  },

];
