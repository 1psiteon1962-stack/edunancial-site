export type MembershipTier =
  | "free"
  | "basic"
  | "premium"
  | "enterprise"
  | "beta";

export type MembershipPlanId = Exclude<MembershipTier, "free">;
export type CheckoutMembershipPlanId = "trial" | "basic" | "pro" | "gold";

export const MEMBERSHIP_PLAN_ALIASES: Record<CheckoutMembershipPlanId, MembershipPlanId> = {
  trial: "beta",
  basic: "basic",
  pro: "premium",
  gold: "enterprise",
};

export interface MembershipPlan {
  id: MembershipPlanId;
  name: string;
  description: string;
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
  billingLabel: string;
  ctaLabel: string;
  isPublic: boolean;
  requiresApproval?: boolean;
  showContactOnly?: boolean;
  legalNote?: string;
}

export const membershipPlans: MembershipPlan[] = [
  {
    id: "basic",
    name: "Basic Membership",
    description:
      "Structured learning resources, guided sessions, practical exercises, and member tools for financial literacy and competency growth.",
    monthlyPrice: 9.99,
    annualPrice: 119.88,
    currency: "USD",
    featured: true,
    assessmentIncluded: true,
    marketplaceIncluded: true,
    aiCoachIncluded: true,
    downloadableCourses: true,
    prioritySupport: false,
    maxCertificates: 12,
    billingLabel: "per month",
    ctaLabel: "Choose Individual Membership",
    isPublic: true,
  },
  {
    id: "premium",
    name: "Pro Membership",
    description:
      "Expanded member benefits with deeper learning access, downloads, and AI financial coach support.",
    monthlyPrice: 29,
    annualPrice: 348,
    currency: "USD",
    featured: false,
    assessmentIncluded: true,
    marketplaceIncluded: true,
    aiCoachIncluded: true,
    downloadableCourses: true,
    prioritySupport: true,
    maxCertificates: 50,
    billingLabel: "per month",
    ctaLabel: "Choose Pro Membership",
    isPublic: true,
  },
  {
    id: "enterprise",
    name: "Gold Membership",
    description:
      "Full membership access for advanced learners with priority support and premium tools.",
    monthlyPrice: 59,
    annualPrice: 708,
    currency: "USD",
    featured: false,
    assessmentIncluded: true,
    marketplaceIncluded: true,
    aiCoachIncluded: true,
    downloadableCourses: true,
    prioritySupport: true,
    maxCertificates: 500,
    billingLabel: "per month",
    ctaLabel: "Choose Gold Membership",
    isPublic: true,
  },
  {
    id: "beta",
    name: "Trial Membership",
    description:
      "Optional starter plan for North America launch campaigns when trial enrollment is enabled.",
    monthlyPrice: 0,
    annualPrice: 0,
    currency: "USD",
    featured: false,
    assessmentIncluded: true,
    marketplaceIncluded: true,
    aiCoachIncluded: true,
    downloadableCourses: true,
    prioritySupport: true,
    maxCertificates: 3,
    billingLabel: "introductory trial",
    ctaLabel: "Start Trial Membership",
    isPublic: process.env.NEXT_PUBLIC_TRIAL_MEMBERSHIP_ENABLED === "true",
    legalNote: "Trial availability is controlled by launch configuration.",
  },
];

export const publicMembershipPlans = membershipPlans.filter((plan) => plan.isPublic);

export function resolveMembershipPlanId(
  planId: string | undefined
): MembershipPlanId | undefined {
  if (!planId) return undefined;

  if (planId in MEMBERSHIP_PLAN_ALIASES) {
    return MEMBERSHIP_PLAN_ALIASES[planId as CheckoutMembershipPlanId];
  }

  return membershipPlans.some((plan) => plan.id === planId)
    ? (planId as MembershipPlanId)
    : undefined;
}
