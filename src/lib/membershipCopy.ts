import { translate } from "@/lib/international/i18n";

export type MembershipCopyLanguage = string;

export function resolveMembershipCopyLanguage(language: string): MembershipCopyLanguage {
  return language;
}

const PLAN_KEY_BY_ID = {
  basic: "basic",
  premium: "pro",
  enterprise: "gold",
  beta: "beta",
} as const;

const FEATURE_KEY_BY_ID = {
  assessmentIncluded: "assessmentIncluded",
  marketplaceIncluded: "marketplaceIncluded",
  aiCoachIncluded: "aiCoachIncluded",
  downloadableCourses: "downloadableCourses",
  prioritySupport: "prioritySupport",
  maxCertificates: "maxCertificates",
} as const;

type PlanId = keyof typeof PLAN_KEY_BY_ID;
type FeatureId = keyof typeof FEATURE_KEY_BY_ID;

export function getMembershipPlanCopy(planId: PlanId, language: MembershipCopyLanguage) {
  const planKey = PLAN_KEY_BY_ID[planId];
  const prefix = `membershipCopy.plan.${planKey}`;
  const legalKey = `${prefix}.legalNote`;
  const legalNote = translate(language, legalKey);

  return {
    name: translate(language, `${prefix}.name`),
    description: translate(language, `${prefix}.description`),
    billingLabel: translate(language, `${prefix}.billingLabel`),
    ctaLabel: translate(language, `${prefix}.ctaLabel`),
    legalNote: legalNote === legalKey ? undefined : legalNote,
  };
}

export function getMembershipFeatureLabel(feature: FeatureId, language: MembershipCopyLanguage) {
  return translate(language, `membershipCopy.feature.${FEATURE_KEY_BY_ID[feature]}`);
}
