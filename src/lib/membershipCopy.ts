import { translate } from "@/lib/international/i18n";

export type MembershipCopyLanguage = string;
export function resolveMembershipCopyLanguage(language: string): MembershipCopyLanguage { return language; }
const PLAN_KEY_BY_ID = { basic: "basic", premium: "pro", enterprise: "gold", beta: "beta" } as const;
const FEATURE_KEY_BY_ID = { assessmentIncluded: "assessmentIncluded", marketplaceIncluded: "marketplaceIncluded", aiCoachIncluded: "aiCoachIncluded", downloadableCourses: "downloadableCourses", prioritySupport: "prioritySupport", maxCertificates: "maxCertificates" } as const;
type PlanId = keyof typeof PLAN_KEY_BY_ID;
type FeatureId = keyof typeof FEATURE_KEY_BY_ID;
const PLAN_FALLBACKS: Record<(typeof PLAN_KEY_BY_ID)[PlanId], { name:string; description:string; billingLabel:string; ctaLabel:string }> = {
  basic: { name:"Basic", description:"Build your financial foundation.", billingLabel:"Monthly membership", ctaLabel:"Choose Basic" },
  pro: { name:"Pro", description:"Advance from literacy to applied financial competency.", billingLabel:"Monthly membership", ctaLabel:"Choose Pro" },
  gold: { name:"Gold", description:"Access the complete Edunancial learning experience.", billingLabel:"Monthly membership", ctaLabel:"Choose Gold" },
  beta: { name:"Beta", description:"Beta membership access.", billingLabel:"Membership", ctaLabel:"Choose Beta" },
};
function translatedOrFallback(language:string,key:string,fallback:string){const value=translate(language,key);return !value||value===key||value.startsWith("membershipCopy.")?fallback:value;}
export function getMembershipPlanCopy(planId:PlanId,language:MembershipCopyLanguage){const planKey=PLAN_KEY_BY_ID[planId],prefix=`membershipCopy.plan.${planKey}`,fallback=PLAN_FALLBACKS[planKey],legalKey=`${prefix}.legalNote`,legalNote=translate(language,legalKey);return {name:translatedOrFallback(language,`${prefix}.name`,fallback.name),description:translatedOrFallback(language,`${prefix}.description`,fallback.description),billingLabel:translatedOrFallback(language,`${prefix}.billingLabel`,fallback.billingLabel),ctaLabel:translatedOrFallback(language,`${prefix}.ctaLabel`,fallback.ctaLabel),legalNote:legalNote===legalKey||legalNote.startsWith("membershipCopy.")?undefined:legalNote};}
export function getMembershipFeatureLabel(feature:FeatureId,language:MembershipCopyLanguage){const key=`membershipCopy.feature.${FEATURE_KEY_BY_ID[feature]}`,value=translate(language,key);return value===key?FEATURE_KEY_BY_ID[feature].replace(/([A-Z])/g," $1").replace(/^./,(char)=>char.toUpperCase()):value;}
