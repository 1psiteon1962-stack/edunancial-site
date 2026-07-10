/**
 * Data Governance Module
 * Implements data ownership, metadata management, catalog, lineage,
 * quality rules, validation standards, versioning, and master data management.
 */

import type { DataClassification } from "../enterprise-data-model";

// ---------------------------------------------------------------------------
// Data Ownership
// ---------------------------------------------------------------------------

export interface DataOwnership {
  entityType: string;
  ownerTeam: string;
  ownerEmail: string;
  stewardEmail?: string;
  dataClassification: DataClassification;
  piiContains: boolean;
  piiFields: string[];
  sensitiveFields: string[];
  legalBasis?: string;
}

const DATA_OWNERSHIP_REGISTRY: Record<string, DataOwnership> = {
  members: {
    entityType: "members",
    ownerTeam: "platform",
    ownerEmail: "data-platform@edunancial.com",
    stewardEmail: "privacy@edunancial.com",
    dataClassification: "confidential",
    piiContains: true,
    piiFields: ["email", "phone", "firstName", "lastName", "dateOfBirth"],
    sensitiveFields: ["gdprConsent", "marketingConsent", "ipHash"],
    legalBasis: "contract",
  },
  memberships: {
    entityType: "memberships",
    ownerTeam: "product",
    ownerEmail: "product@edunancial.com",
    dataClassification: "confidential",
    piiContains: false,
    piiFields: [],
    sensitiveFields: ["pricePaid", "paymentMethodId"],
    legalBasis: "contract",
  },
  payments: {
    entityType: "payments",
    ownerTeam: "finance",
    ownerEmail: "finance@edunancial.com",
    stewardEmail: "compliance@edunancial.com",
    dataClassification: "restricted",
    piiContains: true,
    piiFields: ["memberId"],
    sensitiveFields: ["amount", "providerTransactionId", "ipHash"],
    legalBasis: "legal_obligation",
  },
  audit_logs: {
    entityType: "audit_logs",
    ownerTeam: "security",
    ownerEmail: "security@edunancial.com",
    dataClassification: "restricted",
    piiContains: true,
    piiFields: ["actorEmail", "actorIpHash", "actorUserAgent"],
    sensitiveFields: ["entityVersionBefore", "entityVersionAfter"],
    legalBasis: "legal_obligation",
  },
  ai_interactions: {
    entityType: "ai_interactions",
    ownerTeam: "ai",
    ownerEmail: "ai-platform@edunancial.com",
    stewardEmail: "privacy@edunancial.com",
    dataClassification: "confidential",
    piiContains: false,
    piiFields: [],
    sensitiveFields: ["inputHash", "outputHash", "feedbackText"],
    legalBasis: "legitimate_interest",
  },
  courses: {
    entityType: "courses",
    ownerTeam: "content",
    ownerEmail: "content@edunancial.com",
    dataClassification: "public",
    piiContains: false,
    piiFields: [],
    sensitiveFields: ["price"],
    legalBasis: "contract",
  },
  support_tickets: {
    entityType: "support_tickets",
    ownerTeam: "support",
    ownerEmail: "support-ops@edunancial.com",
    dataClassification: "confidential",
    piiContains: true,
    piiFields: ["memberId", "description"],
    sensitiveFields: [],
    legalBasis: "contract",
  },
  calculator_sessions: {
    entityType: "calculator_sessions",
    ownerTeam: "product",
    ownerEmail: "product@edunancial.com",
    stewardEmail: "privacy@edunancial.com",
    dataClassification: "confidential",
    piiContains: true,
    piiFields: ["memberId"],
    sensitiveFields: ["inputData", "resultData"],
    legalBasis: "consent",
  },
};

export function getDataOwnership(entityType: string): DataOwnership | undefined {
  return DATA_OWNERSHIP_REGISTRY[entityType];
}

export function getAllDataOwnerships(): DataOwnership[] {
  return Object.values(DATA_OWNERSHIP_REGISTRY);
}

// ---------------------------------------------------------------------------
// Data Catalog Entry
// ---------------------------------------------------------------------------

export interface DataCatalogEntry {
  entityType: string;
  entityName: string;
  friendlyName: string;
  description: string;
  ownership: DataOwnership;
  sourceSystems: string[];
  downstreamSystems: string[];
  refreshFrequency: string;
  schemaVersion: string;
  tags: string[];
  retentionDays: number;
}

const DATA_CATALOG: DataCatalogEntry[] = [
  {
    entityType: "members",
    entityName: "members",
    friendlyName: "Member Profiles",
    description: "Core identity and profile data for all Edunancial members",
    ownership: DATA_OWNERSHIP_REGISTRY.members,
    sourceSystems: ["web", "mobile", "sso"],
    downstreamSystems: ["warehouse", "email", "ai-platform"],
    refreshFrequency: "real-time",
    schemaVersion: "1.0",
    tags: ["pii", "gdpr", "ccpa", "core"],
    retentionDays: 3650,
  },
  {
    entityType: "memberships",
    entityName: "memberships",
    friendlyName: "Member Subscriptions",
    description: "Subscription and membership tier data",
    ownership: DATA_OWNERSHIP_REGISTRY.memberships,
    sourceSystems: ["web", "payment-gateway"],
    downstreamSystems: ["warehouse", "analytics"],
    refreshFrequency: "real-time",
    schemaVersion: "1.0",
    tags: ["billing", "subscription"],
    retentionDays: 3650,
  },
  {
    entityType: "payments",
    entityName: "payments",
    friendlyName: "Payment Transactions",
    description: "All payment and financial transaction records",
    ownership: DATA_OWNERSHIP_REGISTRY.payments,
    sourceSystems: ["stripe", "square", "paypal"],
    downstreamSystems: ["accounting", "warehouse", "analytics"],
    refreshFrequency: "real-time",
    schemaVersion: "1.0",
    tags: ["financial", "pci", "restricted"],
    retentionDays: 2555,
  },
  {
    entityType: "courses",
    entityName: "courses",
    friendlyName: "Course Catalog",
    description: "Course content metadata and configuration",
    ownership: DATA_OWNERSHIP_REGISTRY.courses,
    sourceSystems: ["cms", "web"],
    downstreamSystems: ["warehouse", "ai-platform", "search"],
    refreshFrequency: "on-publish",
    schemaVersion: "1.0",
    tags: ["content", "public"],
    retentionDays: 1825,
  },
  {
    entityType: "audit_logs",
    entityName: "audit_logs",
    friendlyName: "Security Audit Logs",
    description: "Immutable log of all system actions and security events",
    ownership: DATA_OWNERSHIP_REGISTRY.audit_logs,
    sourceSystems: ["all-services"],
    downstreamSystems: ["siem", "compliance"],
    refreshFrequency: "real-time",
    schemaVersion: "1.0",
    tags: ["security", "compliance", "immutable"],
    retentionDays: 2555,
  },
  {
    entityType: "ai_interactions",
    entityName: "ai_interactions",
    friendlyName: "AI Interaction Records",
    description: "Records of AI model interactions with privacy-preserving hashes",
    ownership: DATA_OWNERSHIP_REGISTRY.ai_interactions,
    sourceSystems: ["ai-tutor", "recommendation-engine", "chat"],
    downstreamSystems: ["ai-training", "analytics"],
    refreshFrequency: "real-time",
    schemaVersion: "1.0",
    tags: ["ai", "privacy", "gdpr"],
    retentionDays: 365,
  },
];

export function lookupCatalog(entityType: string): DataCatalogEntry | undefined {
  return DATA_CATALOG.find((e) => e.entityType === entityType);
}

export function getFullCatalog(): DataCatalogEntry[] {
  return DATA_CATALOG;
}

// ---------------------------------------------------------------------------
// Data Lineage
// ---------------------------------------------------------------------------

export interface LineageEdge {
  sourceEntity: string;
  sourceField?: string;
  targetEntity: string;
  targetField?: string;
  transformation?: string;
  pipelineName?: string;
}

const LINEAGE_GRAPH: LineageEdge[] = [
  { sourceEntity: "members", targetEntity: "memberships", pipelineName: "subscription-create" },
  { sourceEntity: "members", targetEntity: "course_enrollments", pipelineName: "enrollment-create" },
  { sourceEntity: "members", targetEntity: "payments", pipelineName: "payment-create" },
  { sourceEntity: "members", targetEntity: "audit_logs", pipelineName: "audit-trail" },
  { sourceEntity: "members", targetEntity: "ai_interactions", pipelineName: "ai-session" },
  { sourceEntity: "members", targetEntity: "analytics_member_daily", transformation: "daily-aggregate", pipelineName: "warehouse-etl" },
  { sourceEntity: "payments", targetEntity: "analytics_revenue_daily", transformation: "daily-aggregate", pipelineName: "warehouse-etl" },
  { sourceEntity: "course_enrollments", targetEntity: "analytics_course_daily", transformation: "daily-aggregate", pipelineName: "warehouse-etl" },
  { sourceEntity: "lesson_progress", targetEntity: "course_enrollments", sourceField: "progressPercent", targetField: "progressPercent", transformation: "progress-rollup" },
  { sourceEntity: "course_enrollments", targetEntity: "certificates", pipelineName: "certificate-issue" },
  { sourceEntity: "ai_interactions", targetEntity: "ai_dataset_registry", transformation: "anonymize-aggregate", pipelineName: "ai-training-etl" },
];

export function getDownstreamEntities(entityType: string): LineageEdge[] {
  return LINEAGE_GRAPH.filter((e) => e.sourceEntity === entityType);
}

export function getUpstreamEntities(entityType: string): LineageEdge[] {
  return LINEAGE_GRAPH.filter((e) => e.targetEntity === entityType);
}

// ---------------------------------------------------------------------------
// Data Quality Rules
// ---------------------------------------------------------------------------

export interface QualityRule {
  ruleName: string;
  entityType: string;
  fieldName?: string;
  ruleType: "not_null" | "unique" | "format" | "range" | "referential" | "custom";
  description: string;
  severity: "info" | "warning" | "error" | "critical";
  validate: (value: unknown, record?: Record<string, unknown>) => boolean;
  remediation?: string;
}

export const DATA_QUALITY_RULES: QualityRule[] = [
  {
    ruleName: "member_email_required",
    entityType: "members",
    fieldName: "email",
    ruleType: "not_null",
    description: "Member email must not be null or empty",
    severity: "critical",
    validate: (v) => typeof v === "string" && v.trim().length > 0,
    remediation: "Set a valid email address before saving the member record",
  },
  {
    ruleName: "member_email_format",
    entityType: "members",
    fieldName: "email",
    ruleType: "format",
    description: "Member email must be a valid email address",
    severity: "error",
    validate: (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    remediation: "Correct the email format to user@domain.tld",
  },
  {
    ruleName: "member_gdpr_consent_recorded",
    entityType: "members",
    fieldName: "gdprConsent",
    ruleType: "custom",
    description: "GDPR consent must be explicitly recorded for EU members",
    severity: "critical",
    validate: (v, record) => {
      if (record?.region === "EU") {
        return v === true && record?.gdprConsentAt != null;
      }
      return true;
    },
    remediation: "Record GDPR consent with timestamp for EU region members",
  },
  {
    ruleName: "payment_amount_positive",
    entityType: "payments",
    fieldName: "amount",
    ruleType: "range",
    description: "Payment amount must be greater than zero",
    severity: "error",
    validate: (v) => typeof v === "number" && v > 0,
    remediation: "Correct the payment amount to a positive value",
  },
  {
    ruleName: "certificate_number_unique",
    entityType: "certificates",
    fieldName: "certificateNumber",
    ruleType: "unique",
    description: "Certificate number must be globally unique",
    severity: "critical",
    validate: (v) => typeof v === "string" && v.trim().length > 0,
    remediation: "Generate a unique certificate number",
  },
  {
    ruleName: "lesson_sort_order_non_negative",
    entityType: "lessons",
    fieldName: "sortOrder",
    ruleType: "range",
    description: "Lesson sort order must be non-negative",
    severity: "warning",
    validate: (v) => typeof v === "number" && v >= 0,
    remediation: "Set sortOrder to 0 or greater",
  },
  {
    ruleName: "enrollment_progress_range",
    entityType: "course_enrollments",
    fieldName: "progressPercent",
    ruleType: "range",
    description: "Enrollment progress must be between 0 and 100",
    severity: "error",
    validate: (v) => typeof v === "number" && v >= 0 && v <= 100,
    remediation: "Clamp progressPercent to 0–100 range",
  },
  {
    ruleName: "ai_interaction_no_raw_pii",
    entityType: "ai_interactions",
    fieldName: "piiRedacted",
    ruleType: "custom",
    description: "AI interactions with detected PII must have PII redacted before storage",
    severity: "critical",
    validate: (_v, record) => {
      if (record?.piiDetected === true) {
        return record?.piiRedacted === true;
      }
      return true;
    },
    remediation: "Run PII redaction pipeline before storing AI interaction",
  },
];

export function validateRecord(
  entityType: string,
  record: Record<string, unknown>
): Array<{ rule: QualityRule; field?: string; value: unknown }> {
  const violations: Array<{ rule: QualityRule; field?: string; value: unknown }> = [];
  const rules = DATA_QUALITY_RULES.filter((r) => r.entityType === entityType);

  for (const rule of rules) {
    const value = rule.fieldName ? record[rule.fieldName] : undefined;
    if (!rule.validate(value, record)) {
      violations.push({ rule, field: rule.fieldName, value });
    }
  }

  return violations;
}

// ---------------------------------------------------------------------------
// Master Data Management
// ---------------------------------------------------------------------------

export interface MasterDataValue {
  code: string;
  value: string;
  description?: string;
  parentCode?: string;
  isActive: boolean;
  validFrom?: Date;
  validTo?: Date;
  regionalLabels: Record<string, string>;
}

export type MasterDataDomain =
  | "country"
  | "currency"
  | "language"
  | "region"
  | "membership_tier"
  | "course_category"
  | "payment_provider";

const MASTER_DATA: Partial<Record<MasterDataDomain, MasterDataValue[]>> = {
  region: [
    { code: "NA", value: "North America", isActive: true, regionalLabels: {} },
    { code: "LA", value: "Latin America", isActive: true, regionalLabels: {} },
    { code: "EU", value: "Europe", isActive: true, regionalLabels: {} },
    { code: "APAC", value: "Asia-Pacific", isActive: true, regionalLabels: {} },
    { code: "MENA", value: "Middle East & North Africa", isActive: true, regionalLabels: {} },
    { code: "SSA", value: "Sub-Saharan Africa", isActive: true, regionalLabels: {} },
    { code: "CARIB", value: "Caribbean", isActive: true, regionalLabels: {} },
  ],
  membership_tier: [
    { code: "free", value: "Free", isActive: true, regionalLabels: {} },
    { code: "starter", value: "Starter", isActive: true, regionalLabels: {} },
    { code: "professional", value: "Professional", isActive: true, regionalLabels: {} },
    { code: "enterprise", value: "Enterprise", isActive: true, regionalLabels: {} },
    { code: "lifetime", value: "Lifetime", isActive: true, regionalLabels: {} },
  ],
  payment_provider: [
    { code: "stripe", value: "Stripe", isActive: true, regionalLabels: {} },
    { code: "square", value: "Square", isActive: true, regionalLabels: {} },
    { code: "paypal", value: "PayPal", isActive: true, regionalLabels: {} },
    { code: "bank_transfer", value: "Bank Transfer", isActive: true, regionalLabels: {} },
    { code: "manual", value: "Manual", isActive: true, regionalLabels: {} },
  ],
};

export function getMasterData(domain: MasterDataDomain): MasterDataValue[] {
  return MASTER_DATA[domain] ?? [];
}

export function getMasterDataValue(
  domain: MasterDataDomain,
  code: string
): MasterDataValue | undefined {
  return getMasterData(domain).find((v) => v.code === code);
}

export function isValidMasterDataCode(domain: MasterDataDomain, code: string): boolean {
  const value = getMasterDataValue(domain, code);
  return value !== undefined && value.isActive;
}
