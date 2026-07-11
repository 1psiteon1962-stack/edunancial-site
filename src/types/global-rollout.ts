import type { PaymentProviderType } from "@/lib/payments/providers";

export type ContinentCode =
  | "north-america"
  | "latin-america"
  | "caribbean"
  | "europe"
  | "asia-pacific"
  | "africa";

export type RegionCode =
  | "north-america"
  | "quebec"
  | "latin-america"
  | "caribbean"
  | "europe"
  | "asia-pacific"
  | "africa";

export type LanguageCode =
  | "en"
  | "es"
  | "fr"
  | "pt"
  | "ar"
  | "ja"
  | "ko";

export type CurrencyCode =
  | "USD"
  | "CAD"
  | "MXN"
  | "DOP"
  | "EUR"
  | "BRL"
  | "UGX"
  | "KES"
  | "ZAR"
  | "JPY";

export type TaxProfileId =
  | "us-sales-tax"
  | "canada-gst-hst"
  | "quebec-gst-qst"
  | "eu-vat"
  | "latam-placeholder"
  | "caribbean-placeholder"
  | "apac-placeholder"
  | "africa-placeholder";

export type ComplianceProfileId =
  | "united-states"
  | "canada"
  | "quebec"
  | "eu-gdpr"
  | "latin-america-ready"
  | "caribbean-ready"
  | "asia-pacific-ready"
  | "africa-ready";

export type RolloutFeature =
  | "marketplace"
  | "aiCoach"
  | "familyLearning"
  | "financialPassport"
  | "memberships";

export type ProductId =
  | "wealth-building-red-white-blue"
  | "business-is-about-making-profit"
  | "economic-self-defense"
  | "financial-competency";

export type CourseId =
  | "real-estate-competency"
  | "financial-asset-competency"
  | "business-competency";

export type MembershipPlanId = "core" | "family" | "business";

export type AIFeatureId = "ai-coach" | "financial-passport";

export type MarketingCampaignId =
  | "north-america-launch"
  | "canada-growth"
  | "latam-readiness"
  | "eu-readiness"
  | "africa-readiness"
  | "apac-readiness";

export type ReadinessFlag =
  | "translationsReady"
  | "legalReviewReady"
  | "paymentReady"
  | "taxReady"
  | "privacyReady"
  | "contentReady"
  | "marketingReady"
  | "supportReady";

export interface ContinentDefinition {
  code: ContinentCode;
  name: string;
  enabled: boolean;
}

export interface RegionDefinition {
  code: RegionCode;
  continentCode: ContinentCode;
  name: string;
  enabled: boolean;
}

export interface LanguageDefinition {
  code: LanguageCode;
  name: string;
  nativeName: string;
  enabled: boolean;
}

export interface CurrencyDefinition {
  code: CurrencyCode;
  name: string;
  symbol: string;
  enabled: boolean;
}

export interface TaxProfile {
  id: TaxProfileId;
  name: string;
  description: string;
}

export interface ComplianceProfile {
  id: ComplianceProfileId;
  name: string;
  description: string;
  privacyModel: string;
  requirements: string[];
}

export interface ReadinessStatus {
  translationsReady: boolean;
  legalReviewReady: boolean;
  paymentReady: boolean;
  taxReady: boolean;
  privacyReady: boolean;
  contentReady: boolean;
  marketingReady: boolean;
  supportReady: boolean;
}

export interface CountryRolloutDefinition {
  code: string;
  name: string;
  continentCode: ContinentCode;
  regionCode: RegionCode;
  enabled: boolean;
  defaultLanguage: LanguageCode;
  defaultCurrency: CurrencyCode;
  timeZones: string[];
  taxProfileId: TaxProfileId;
  complianceProfileId: ComplianceProfileId;
  supportedLanguages: LanguageCode[];
  supportedCurrencies: CurrencyCode[];
  paymentProviders: PaymentProviderType[];
  products: ProductId[];
  courses: CourseId[];
  membershipPlans: MembershipPlanId[];
  aiFeatures: AIFeatureId[];
  marketingCampaigns: MarketingCampaignId[];
  featureAvailability: Record<RolloutFeature, boolean>;
  readiness: ReadinessStatus;
  subdivisionComplianceOverrides?: Record<string, ComplianceProfileId>;
}

export interface CatalogItem<T extends string> {
  id: T;
  label: string;
}

export interface GlobalRolloutConfig {
  continents: ContinentDefinition[];
  regions: RegionDefinition[];
  languages: LanguageDefinition[];
  currencies: CurrencyDefinition[];
  taxProfiles: TaxProfile[];
  complianceProfiles: ComplianceProfile[];
  products: CatalogItem<ProductId>[];
  courses: CatalogItem<CourseId>[];
  membershipPlans: CatalogItem<MembershipPlanId>[];
  aiFeatures: CatalogItem<AIFeatureId>[];
  marketingCampaigns: CatalogItem<MarketingCampaignId>[];
  countries: CountryRolloutDefinition[];
}
