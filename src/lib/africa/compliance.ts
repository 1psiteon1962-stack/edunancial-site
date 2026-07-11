// ======================================================
// AFRICA REGIONAL FOUNDATION
// compliance.ts – Regulatory and compliance framework
// ======================================================

export type ComplianceStatus =
  | "not_started"
  | "in_review"
  | "compliant"
  | "requires_update"
  | "blocked";

export interface AfricaComplianceFramework {
  countryIso: string;
  /** Data-protection regulation (e.g. POPIA, NDPR) */
  dataProtectionLaw: string | null;
  /** Responsible AI / algorithmic accountability framework */
  aiRegulation: string | null;
  /** Consumer-protection regime */
  consumerProtectionLaw: string | null;
  /** E-commerce / digital-market regulation */
  eCommerceRegulation: string | null;
  /** Whether local data residency is required */
  dataResidencyRequired: boolean;
  /** Whether localised terms of service are required */
  localTermsRequired: boolean;
  /** Whether localised privacy policy is required */
  localPrivacyPolicyRequired: boolean;
  /** Current compliance readiness status */
  status: ComplianceStatus;
  notes: string;
}

export const AFRICA_COMPLIANCE: AfricaComplianceFramework[] = [
  {
    countryIso: "ZA",
    dataProtectionLaw: "POPIA (Protection of Personal Information Act)",
    aiRegulation: null,
    consumerProtectionLaw: "Consumer Protection Act 68 of 2008",
    eCommerceRegulation: "Electronic Communications and Transactions Act",
    dataResidencyRequired: false,
    localTermsRequired: true,
    localPrivacyPolicyRequired: true,
    status: "not_started",
    notes: "POPIA enforcement active since 2021. DPO registration recommended.",
  },
  {
    countryIso: "NG",
    dataProtectionLaw: "NDPR (Nigeria Data Protection Regulation)",
    aiRegulation: null,
    consumerProtectionLaw: "Federal Competition and Consumer Protection Act",
    eCommerceRegulation: "FCCPA 2018",
    dataResidencyRequired: false,
    localTermsRequired: true,
    localPrivacyPolicyRequired: true,
    status: "not_started",
    notes: "NDPR 2019; NITDA compliance audit may apply.",
  },
  {
    countryIso: "KE",
    dataProtectionLaw: "Data Protection Act 2019",
    aiRegulation: null,
    consumerProtectionLaw: "Consumer Protection Act 2012",
    eCommerceRegulation: "Kenya Information and Communications Act",
    dataResidencyRequired: false,
    localTermsRequired: false,
    localPrivacyPolicyRequired: true,
    status: "not_started",
    notes: "Office of the Data Protection Commissioner registration required.",
  },
  {
    countryIso: "GH",
    dataProtectionLaw: "Data Protection Act 2012 (Act 843)",
    aiRegulation: null,
    consumerProtectionLaw: "Consumer Protection Agency Act 2022",
    eCommerceRegulation: "Electronic Transactions Act 2008",
    dataResidencyRequired: false,
    localTermsRequired: false,
    localPrivacyPolicyRequired: true,
    status: "not_started",
    notes: "DPC registration required before processing Ghanaian personal data.",
  },
  {
    countryIso: "EG",
    dataProtectionLaw: "Personal Data Protection Law No. 151 of 2020",
    aiRegulation: null,
    consumerProtectionLaw: "Consumer Protection Law No. 181 of 2018",
    eCommerceRegulation: "E-Signature Law No. 15 of 2004",
    dataResidencyRequired: true,
    localTermsRequired: true,
    localPrivacyPolicyRequired: true,
    status: "not_started",
    notes: "Data residency requirements: personal data of Egyptian residents should be stored locally.",
  },
  {
    countryIso: "MA",
    dataProtectionLaw: "Law 09-08 on Personal Data Protection",
    aiRegulation: null,
    consumerProtectionLaw: "Law 31-08 on Consumer Protection",
    eCommerceRegulation: "Law 53-05 on Electronic Exchange of Legal Data",
    dataResidencyRequired: false,
    localTermsRequired: false,
    localPrivacyPolicyRequired: true,
    status: "not_started",
    notes: "CNDP (Commission Nationale de contrôle de la protection des Données à caractère Personnel).",
  },
];

/** Default used when no country-specific entry exists. */
export const AFRICA_COMPLIANCE_DEFAULT: AfricaComplianceFramework = {
  countryIso: "default",
  dataProtectionLaw: null,
  aiRegulation: null,
  consumerProtectionLaw: null,
  eCommerceRegulation: null,
  dataResidencyRequired: false,
  localTermsRequired: false,
  localPrivacyPolicyRequired: false,
  status: "not_started",
  notes: "Compliance review not yet initiated for this country.",
};

/** Get the compliance framework for a given country. */
export function getAfricaCompliance(
  countryIso: string
): AfricaComplianceFramework {
  return (
    AFRICA_COMPLIANCE.find(
      (c) => c.countryIso.toLowerCase() === countryIso.toLowerCase()
    ) ?? AFRICA_COMPLIANCE_DEFAULT
  );
}

/** Returns true when all required compliance items are satisfied for launch. */
export function isCountryComplianceReady(countryIso: string): boolean {
  const c = getAfricaCompliance(countryIso);
  return c.status === "compliant";
}
