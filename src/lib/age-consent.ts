export interface AgeConsentRule {
  privacySelfConsentAge: number;
  sourceNote: string;
  manualReviewBelowAge?: number;
}

/**
 * Launch jurisdictions currently exposed by the registration form.
 *
 * privacySelfConsentAge is deliberately separate from contractual age of majority.
 * It answers only whether a free user may self-consent to the account's ordinary
 * privacy processing. Paid transactions use the adult-purchaser attestation at checkout.
 *
 * This table must be reviewed whenever a jurisdiction's child-privacy rules change.
 */
export const AGE_CONSENT_RULES: Record<string, AgeConsentRule> = {
  "United States": {
    privacySelfConsentAge: 13,
    sourceNote: "COPPA: parental consent for covered processing involving children under 13.",
  },
  Canada: {
    privacySelfConsentAge: 13,
    sourceNote: "OPC: under 13 generally cannot provide meaningful consent; youth notices must be age appropriate.",
  },
  Mexico: {
    privacySelfConsentAge: 18,
    sourceNote: "Minor-data consent follows applicable civil representation rules; guardian review used for launch.",
  },
  "United Kingdom": {
    privacySelfConsentAge: 13,
    sourceNote: "UK GDPR/DPA 2018: parental authorization below 13 when relying on consent for an online service.",
  },
  Australia: {
    privacySelfConsentAge: 16,
    sourceNote: "OAIC practical presumption: 15+ may generally be presumed capable; under 15 presumed not capable where case-by-case assessment is impracticable.",
  },
  Nigeria: {
    privacySelfConsentAge: 18,
    sourceNote: "Nigeria Data Protection Act/NDPC: parental or guardian consent where relying on consent for a child; child is generally under 18.",
  },
  Ghana: {
    privacySelfConsentAge: 18,
    sourceNote: "Ghana DPC compliance guidance asks controllers processing minors to obtain parental/guardian consent.",
  },
  Jamaica: {
    privacySelfConsentAge: 18,
    sourceNote: "Jamaica Data Protection Act recognizes parent/legal-guardian consent for a minor.",
  },
  "Trinidad and Tobago": {
    privacySelfConsentAge: 18,
    sourceNote: "Launch-safe minor treatment pending jurisdiction-specific counsel review.",
  },
  Barbados: {
    privacySelfConsentAge: 18,
    sourceNote: "Barbados Data Protection Act requires parent/guardian authorization for processing a child's personal data when relying on consent.",
  },
  Other: {
    privacySelfConsentAge: 18,
    manualReviewBelowAge: 18,
    sourceNote: "Unknown jurisdiction: users below 18 are routed for privacy review before account creation.",
  },
};

export function calculateAge(dateOfBirth: string, now = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOfBirth);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const birth = new Date(Date.UTC(year, month - 1, day));
  if (
    birth.getUTCFullYear() !== year ||
    birth.getUTCMonth() !== month - 1 ||
    birth.getUTCDate() !== day ||
    birth.getTime() > now.getTime()
  ) return null;

  let age = now.getUTCFullYear() - year;
  const beforeBirthday =
    now.getUTCMonth() < month - 1 ||
    (now.getUTCMonth() === month - 1 && now.getUTCDate() < day);
  if (beforeBirthday) age -= 1;
  return age >= 0 && age <= 125 ? age : null;
}

export function getPrivacyRegistrationDecision(country: string, dateOfBirth: string) {
  const age = calculateAge(dateOfBirth);
  if (age === null) return { allowed: false as const, age: null, reason: "invalid-date" as const };
  const rule = AGE_CONSENT_RULES[country] ?? AGE_CONSENT_RULES.Other;
  if (age < rule.privacySelfConsentAge) {
    return {
      allowed: false as const,
      age,
      reason: rule.manualReviewBelowAge ? "manual-review" as const : "guardian-consent" as const,
      threshold: rule.privacySelfConsentAge,
    };
  }
  return { allowed: true as const, age, threshold: rule.privacySelfConsentAge };
}

/**
 * A paid checkout must be accepted by someone who either has legal capacity
 * to contract in their jurisdiction or is the minor member's parent/legal guardian.
 * We use an explicit purchaser attestation because age of contractual majority can
 * vary below the country level (for example, by U.S. state) and by transaction type.
 */
export const PAID_PURCHASER_ATTESTATION =
  "I confirm that I have reached the legal age of majority and have capacity to enter this transaction in my jurisdiction, or I am the parent/legal guardian of the minor member and I personally authorize and accept responsibility for this purchase and any disclosed recurring charges.";
