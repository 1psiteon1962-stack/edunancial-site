import {
  DEFAULT_REGION_ID,
  getRegionalConfiguration,
  GlobalRegionId,
} from "./regions";

export type ComplianceFrameworkId =
  | "gdpr"
  | "pipeda"
  | "ccpa-cpra"
  | "cookie-consent"
  | "privacy-notice"
  | "regional-terms";

export interface CompliancePlaceholder {
  framework: ComplianceFrameworkId;
  titleKey: string;
  policyPath: string;
  legalReviewRequired: boolean;
  templateText: string;
}

type RegionalComplianceConfig = Record<GlobalRegionId, CompliancePlaceholder[]>;

const BASE_PLACEHOLDERS: CompliancePlaceholder[] = [
  {
    framework: "cookie-consent",
    titleKey: "compliance.cookieConsent.title",
    policyPath: "/legal/cookies",
    legalReviewRequired: true,
    templateText: "Placeholder template. Legal review required before publication.",
  },
  {
    framework: "privacy-notice",
    titleKey: "compliance.privacyNotice.title",
    policyPath: "/legal/privacy",
    legalReviewRequired: true,
    templateText: "Placeholder template. Legal review required before publication.",
  },
  {
    framework: "regional-terms",
    titleKey: "compliance.terms.title",
    policyPath: "/legal/terms",
    legalReviewRequired: true,
    templateText: "Placeholder template. Legal review required before publication.",
  },
];

const REGIONAL_COMPLIANCE: RegionalComplianceConfig = {
  "north-america": [
    ...BASE_PLACEHOLDERS,
    {
      framework: "ccpa-cpra",
      titleKey: "compliance.ccpa.title",
      policyPath: "/legal/ccpa-cpra",
      legalReviewRequired: true,
      templateText: "Placeholder CCPA/CPRA notice. Legal review required.",
    },
    {
      framework: "pipeda",
      titleKey: "compliance.pipeda.title",
      policyPath: "/legal/pipeda",
      legalReviewRequired: true,
      templateText: "Placeholder PIPEDA notice. Legal review required.",
    },
  ],
  "latin-america": [...BASE_PLACEHOLDERS],
  caribbean: [...BASE_PLACEHOLDERS],
  europe: [
    ...BASE_PLACEHOLDERS,
    {
      framework: "gdpr",
      titleKey: "compliance.gdpr.title",
      policyPath: "/legal/gdpr",
      legalReviewRequired: true,
      templateText: "Placeholder GDPR notice. Legal review required.",
    },
  ],
  africa: [...BASE_PLACEHOLDERS],
  "middle-east": [...BASE_PLACEHOLDERS],
  "asia-pacific": [...BASE_PLACEHOLDERS],
};

export function getRegionalCompliancePlaceholders(
  regionId?: string
): CompliancePlaceholder[] {
  const resolvedRegion = getRegionalConfiguration(regionId).id;

  return (
    REGIONAL_COMPLIANCE[resolvedRegion] ??
    REGIONAL_COMPLIANCE[DEFAULT_REGION_ID] ??
    []
  );
}

export function hasFrameworkForRegion(
  framework: ComplianceFrameworkId,
  regionId?: string
): boolean {
  return getRegionalCompliancePlaceholders(regionId).some(
    (placeholder) => placeholder.framework === framework
  );
}
