export type JurisdictionRisk = 'green' | 'yellow' | 'red';
export type VerificationStatus = 'unverified' | 'verified' | 'stale' | 'conflict';

export interface JurisdictionSelection {
  countryCode: string;
  subdivisionCode?: string;
  language: string;
  taxResidenceCountryCode?: string;
  assetCountryCode?: string;
  businessCountryCode?: string;
}

export interface AuthoritySource {
  id: string;
  jurisdiction: string;
  authority: string;
  title: string;
  url: string;
  sourceType: 'legislation' | 'tax-authority' | 'regulator' | 'court' | 'official-guidance';
  effectiveFrom?: string;
  effectiveTo?: string;
  lastVerifiedAt?: string;
}

export interface JurisdictionRule {
  id: string;
  jurisdiction: string;
  subdivisionCode?: string;
  topics: string[];
  statement: string;
  sourceIds: string[];
  effectiveFrom?: string;
  effectiveTo?: string;
  risk: JurisdictionRisk;
  verificationStatus: VerificationStatus;
  confidence: number;
}

export interface LessonLocalizationContext {
  lessonId: string;
  selection: JurisdictionSelection;
  topics: string[];
  rules: JurisdictionRule[];
  sources: AuthoritySource[];
  generatedAt: string;
  requiresHumanReview: boolean;
}
