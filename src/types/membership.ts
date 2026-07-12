export type MembershipTier =
  | "free"
  | "basic"
  | "premium"
  | "enterprise"
  | "beta";

export type MembershipPlanId = Exclude<MembershipTier, "free">;

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
    name: "Individual Membership",
    description:
      "Structured learning resources, guided sessions, practical exercises, and member tools for individual financial literacy and financial competency growth.",
    monthlyPrice: 19.99,
    annualPrice: 239.88,
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
    name: "Approved Organization Membership",
    description:
      "For approved schools, nonprofits, community organizations, workforce programs, churches, youth organizations, and similar approved partners onboarding members through Edunancial.",
    monthlyPrice: 14.99,
    annualPrice: 179.88,
    currency: "USD",
    featured: false,
    assessmentIncluded: true,
    marketplaceIncluded: true,
    aiCoachIncluded: true,
    downloadableCourses: true,
    prioritySupport: true,
    maxCertificates: 50,
    billingLabel: "per member / month",
    ctaLabel: "Request organization approval",
    isPublic: true,
    requiresApproval: true,
    showContactOnly: true,
    legalNote: "Available only to approved partner organizations.",
  },
  {
    id: "enterprise",
    name: "100+ Member Organization Rate",
    description:
      "For organizations with at least 100 active paid members under a formal organizational agreement.",
    monthlyPrice: 9.99,
    annualPrice: 119.88,
    currency: "USD",
    featured: false,
    assessmentIncluded: true,
    marketplaceIncluded: true,
    aiCoachIncluded: true,
    downloadableCourses: true,
    prioritySupport: true,
    maxCertificates: 500,
    billingLabel: "per active paid member / month",
    ctaLabel: "Contact for 100+ member agreement",
    isPublic: true,
    requiresApproval: true,
    showContactOnly: true,
    legalNote: "Minimum 100 active paid members and a formal organizational agreement required.",
  },
  {
    id: "beta",
    name: "Beta Tester",
    description:
      "Invitation-only access for approved testers evaluating Edunancial membership experiences before public release milestones.",
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
    billingLabel: "invitation only",
    ctaLabel: "Redeem beta invitation",
    isPublic: false,
    legalNote: "Hidden from public pricing. Beta access starts at first successful login and expires 72 hours later unless explicitly extended by an administrator.",
  },
];

export const publicMembershipPlans = membershipPlans.filter((plan) => plan.isPublic);
