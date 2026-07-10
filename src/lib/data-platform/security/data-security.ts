/**
 * Data Security Module
 * Implements encryption standards, access controls, audit logging,
 * data classification, sensitive data tagging, secure export, and privacy compliance.
 */

import type { AuditAction, CreateAuditLogInput, DataClassification, RegionCode } from "../enterprise-data-model";

// ---------------------------------------------------------------------------
// Encryption Standards
// ---------------------------------------------------------------------------

export interface EncryptionConfig {
  algorithm: "AES-256-GCM" | "AES-256-CBC" | "RSA-4096" | "ChaCha20-Poly1305";
  keyLength: number;
  keyRotationDays: number;
  atRest: boolean;
  inTransit: boolean;
  fieldLevel: boolean;
}

export const ENCRYPTION_STANDARDS: Record<string, EncryptionConfig> = {
  database: {
    algorithm: "AES-256-GCM",
    keyLength: 256,
    keyRotationDays: 90,
    atRest: true,
    inTransit: true,
    fieldLevel: false,
  },
  pii_fields: {
    algorithm: "AES-256-GCM",
    keyLength: 256,
    keyRotationDays: 30,
    atRest: true,
    inTransit: true,
    fieldLevel: true,
  },
  payment_data: {
    algorithm: "AES-256-GCM",
    keyLength: 256,
    keyRotationDays: 30,
    atRest: true,
    inTransit: true,
    fieldLevel: true,
  },
  backup: {
    algorithm: "AES-256-CBC",
    keyLength: 256,
    keyRotationDays: 90,
    atRest: true,
    inTransit: true,
    fieldLevel: false,
  },
  api_transport: {
    algorithm: "ChaCha20-Poly1305",
    keyLength: 256,
    keyRotationDays: 365,
    atRest: false,
    inTransit: true,
    fieldLevel: false,
  },
};

// ---------------------------------------------------------------------------
// Data Classification Policy
// ---------------------------------------------------------------------------

export interface ClassificationPolicy {
  classification: DataClassification;
  label: string;
  description: string;
  handlingRequirements: string[];
  encryptionRequired: boolean;
  maskingRequired: boolean;
  accessLogRequired: boolean;
  exportAllowed: boolean;
  retentionPriority: "low" | "medium" | "high" | "critical";
  examplesFields: string[];
}

export const CLASSIFICATION_POLICIES: Record<DataClassification, ClassificationPolicy> = {
  public: {
    classification: "public",
    label: "PUBLIC",
    description: "Information intended for public consumption",
    handlingRequirements: ["no special handling required"],
    encryptionRequired: false,
    maskingRequired: false,
    accessLogRequired: false,
    exportAllowed: true,
    retentionPriority: "low",
    examplesFields: ["course title", "blog article", "public profile"],
  },
  internal: {
    classification: "internal",
    label: "INTERNAL",
    description: "Internal operational data not for public release",
    handlingRequirements: ["restrict to authenticated staff", "no external sharing"],
    encryptionRequired: true,
    maskingRequired: false,
    accessLogRequired: true,
    exportAllowed: true,
    retentionPriority: "medium",
    examplesFields: ["analytics aggregates", "BI reports", "system metrics"],
  },
  confidential: {
    classification: "confidential",
    label: "CONFIDENTIAL",
    description: "Sensitive data requiring controlled access",
    handlingRequirements: [
      "restrict to need-to-know",
      "encrypt at rest and in transit",
      "log all access",
      "no unauthorized export",
    ],
    encryptionRequired: true,
    maskingRequired: true,
    accessLogRequired: true,
    exportAllowed: false,
    retentionPriority: "high",
    examplesFields: ["member email", "member name", "enrollment history", "support tickets"],
  },
  restricted: {
    classification: "restricted",
    label: "RESTRICTED",
    description: "Highly sensitive data with strict access controls",
    handlingRequirements: [
      "minimum access principle",
      "field-level encryption",
      "multi-factor auth required",
      "comprehensive audit trail",
      "no bulk export without approval",
    ],
    encryptionRequired: true,
    maskingRequired: true,
    accessLogRequired: true,
    exportAllowed: false,
    retentionPriority: "critical",
    examplesFields: ["payment card data", "audit logs", "security events"],
  },
  top_secret: {
    classification: "top_secret",
    label: "TOP SECRET",
    description: "Classified data for executive and security leadership only",
    handlingRequirements: [
      "C-level access only",
      "hardware security module",
      "air-gapped systems preferred",
      "dual authorization required",
    ],
    encryptionRequired: true,
    maskingRequired: true,
    accessLogRequired: true,
    exportAllowed: false,
    retentionPriority: "critical",
    examplesFields: ["cryptographic keys", "regulatory investigation data"],
  },
};

export function getClassificationPolicy(classification: DataClassification): ClassificationPolicy {
  return CLASSIFICATION_POLICIES[classification];
}

// ---------------------------------------------------------------------------
// Sensitive Data Tagging
// ---------------------------------------------------------------------------

export type SensitiveDataTag =
  | "pii"
  | "pci"
  | "phi"
  | "financial"
  | "credentials"
  | "biometric"
  | "location"
  | "behavioral"
  | "ai_training_eligible"
  | "gdpr_subject"
  | "ccpa_subject"
  | "legal_hold_candidate";

export interface SensitiveFieldTag {
  entityType: string;
  fieldName: string;
  tags: SensitiveDataTag[];
  maskPattern?: string;
  notes?: string;
}

export const SENSITIVE_FIELD_REGISTRY: SensitiveFieldTag[] = [
  { entityType: "members", fieldName: "email", tags: ["pii", "gdpr_subject", "ccpa_subject"], maskPattern: "***@***" },
  { entityType: "members", fieldName: "phone", tags: ["pii", "gdpr_subject", "ccpa_subject"], maskPattern: "***-***-####" },
  { entityType: "members", fieldName: "firstName", tags: ["pii", "gdpr_subject", "ccpa_subject"], maskPattern: "***" },
  { entityType: "members", fieldName: "lastName", tags: ["pii", "gdpr_subject", "ccpa_subject"], maskPattern: "***" },
  { entityType: "members", fieldName: "dateOfBirth", tags: ["pii", "gdpr_subject", "ccpa_subject"], maskPattern: "****-**-**" },
  { entityType: "members", fieldName: "ipHash", tags: ["pii", "location"], notes: "Stored as one-way hash" },
  { entityType: "payments", fieldName: "amount", tags: ["financial", "pci", "gdpr_subject"] },
  { entityType: "payments", fieldName: "providerTransactionId", tags: ["pci", "financial"] },
  { entityType: "payments", fieldName: "ipHash", tags: ["pii", "location"], notes: "Stored as one-way hash" },
  { entityType: "payment_methods", fieldName: "providerMethodId", tags: ["pci", "credentials"], notes: "Gateway token only - no raw card data" },
  { entityType: "payment_methods", fieldName: "lastFour", tags: ["pci"], maskPattern: "****" },
  { entityType: "calculator_sessions", fieldName: "inputData", tags: ["financial", "gdpr_subject", "ai_training_eligible"] },
  { entityType: "calculator_sessions", fieldName: "resultData", tags: ["financial", "gdpr_subject"] },
  { entityType: "audit_logs", fieldName: "actorEmail", tags: ["pii", "gdpr_subject"] },
  { entityType: "audit_logs", fieldName: "actorIpHash", tags: ["pii", "location"], notes: "Stored as one-way hash" },
  { entityType: "ai_interactions", fieldName: "inputHash", tags: ["ai_training_eligible"], notes: "One-way hash only" },
  { entityType: "support_tickets", fieldName: "description", tags: ["pii", "gdpr_subject", "ccpa_subject"], notes: "May contain PII written by member" },
];

export function getFieldTags(entityType: string, fieldName: string): SensitiveDataTag[] {
  const entry = SENSITIVE_FIELD_REGISTRY.find(
    (r) => r.entityType === entityType && r.fieldName === fieldName
  );
  return entry?.tags ?? [];
}

export function getEntitySensitiveFields(entityType: string): SensitiveFieldTag[] {
  return SENSITIVE_FIELD_REGISTRY.filter((r) => r.entityType === entityType);
}

export function maskField(value: string, maskPattern: string): string {
  if (maskPattern === "***") return "***";
  const chars = maskPattern.split("");
  let valueIdx = 0;
  return chars
    .map((c) => {
      if (c === "#") {
        return value[valueIdx++] ?? "#";
      }
      if (c === "*") {
        valueIdx++;
        return "*";
      }
      return c;
    })
    .join("");
}

// ---------------------------------------------------------------------------
// Access Control
// ---------------------------------------------------------------------------

export interface Permission {
  resource: string;
  action: "read" | "write" | "delete" | "export" | "admin";
  conditions?: Record<string, unknown>;
}

export interface RoleDefinition {
  roleId: string;
  roleName: string;
  description: string;
  permissions: Permission[];
  maxClassification: DataClassification;
  requiresMfa: boolean;
  regionScope: "global" | "assigned";
}

export const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  super_admin: {
    roleId: "super_admin",
    roleName: "Super Administrator",
    description: "Full platform access across all regions",
    permissions: [{ resource: "*", action: "admin" }],
    maxClassification: "top_secret",
    requiresMfa: true,
    regionScope: "global",
  },
  admin: {
    roleId: "admin",
    roleName: "Administrator",
    description: "Regional platform administration",
    permissions: [
      { resource: "members", action: "read" },
      { resource: "members", action: "write" },
      { resource: "memberships", action: "read" },
      { resource: "memberships", action: "write" },
      { resource: "support_tickets", action: "admin" },
      { resource: "courses", action: "admin" },
      { resource: "audit_logs", action: "read" },
    ],
    maxClassification: "confidential",
    requiresMfa: true,
    regionScope: "assigned",
  },
  analyst: {
    roleId: "analyst",
    roleName: "Data Analyst",
    description: "Read-only access to analytics and aggregated data",
    permissions: [
      { resource: "analytics_*", action: "read" },
      { resource: "courses", action: "read" },
      { resource: "audit_logs", action: "read", conditions: { ownActionsOnly: false } },
    ],
    maxClassification: "internal",
    requiresMfa: false,
    regionScope: "assigned",
  },
  support: {
    roleId: "support",
    roleName: "Support Agent",
    description: "Support ticket management and limited member profile access",
    permissions: [
      { resource: "support_tickets", action: "write" },
      { resource: "members", action: "read", conditions: { maskPii: true } },
    ],
    maxClassification: "confidential",
    requiresMfa: false,
    regionScope: "assigned",
  },
  content_manager: {
    roleId: "content_manager",
    roleName: "Content Manager",
    description: "Course and lesson content management",
    permissions: [
      { resource: "courses", action: "write" },
      { resource: "lessons", action: "write" },
      { resource: "blog_articles", action: "write" },
    ],
    maxClassification: "internal",
    requiresMfa: false,
    regionScope: "global",
  },
  ai_engineer: {
    roleId: "ai_engineer",
    roleName: "AI Engineer",
    description: "Access to anonymized AI training datasets and model configurations",
    permissions: [
      { resource: "ai_dataset_registry", action: "read" },
      { resource: "ai_interactions", action: "read", conditions: { anonymizedOnly: true } },
      { resource: "ai_service_registry", action: "admin" },
    ],
    maxClassification: "internal",
    requiresMfa: true,
    regionScope: "global",
  },
};

export function hasPermission(
  roleId: string,
  resource: string,
  action: Permission["action"]
): boolean {
  const role = ROLE_DEFINITIONS[roleId];
  if (!role) return false;

  return role.permissions.some(
    (p) =>
      (p.resource === "*" || p.resource === resource || resource.startsWith(p.resource.replaceAll("*", ""))) &&
      (p.action === "admin" || p.action === action)
  );
}

export function canAccessClassification(
  roleId: string,
  classification: DataClassification
): boolean {
  const role = ROLE_DEFINITIONS[roleId];
  if (!role) return false;

  const levels: DataClassification[] = ["public", "internal", "confidential", "restricted", "top_secret"];
  const roleLevel = levels.indexOf(role.maxClassification);
  const requestedLevel = levels.indexOf(classification);

  return roleLevel >= requestedLevel;
}

// ---------------------------------------------------------------------------
// Audit Log Factory
// ---------------------------------------------------------------------------

export function createAuditEntry(input: CreateAuditLogInput): CreateAuditLogInput {
  return {
    outcome: "success",
    riskLevel: "low",
    dataClassification: "internal",
    ...input,
  };
}

export function createSecurityAuditEntry(
  action: AuditAction,
  actorId: string,
  entityType: string,
  entityId: string,
  outcome: "success" | "failure",
  region?: RegionCode
): CreateAuditLogInput {
  const isFailure = outcome === "failure";
  return {
    action,
    actorId,
    actorType: "admin",
    entityType,
    entityId,
    outcome,
    riskLevel: isFailure ? "high" : "medium",
    dataClassification: "restricted",
    region,
    metadata: { securityEvent: true, timestamp: new Date().toISOString() },
  };
}

// ---------------------------------------------------------------------------
// Secure Export Architecture
// ---------------------------------------------------------------------------

export interface ExportRequest {
  requestId: string;
  requestedBy: string;
  roleId: string;
  entityType: string;
  filters: Record<string, unknown>;
  outputFormat: "csv" | "json" | "parquet";
  region?: RegionCode;
  purpose: string;
  approvedBy?: string;
  approvedAt?: Date;
  expiresAt: Date;
}

export interface ExportApprovalPolicy {
  entityType: string;
  requiresApproval: boolean;
  minimumRole: string;
  allowedFormats: ("csv" | "json" | "parquet")[];
  maxRecords: number;
  maskPiiOnExport: boolean;
  auditRequired: boolean;
}

export const EXPORT_POLICIES: Record<string, ExportApprovalPolicy> = {
  members: {
    entityType: "members",
    requiresApproval: true,
    minimumRole: "admin",
    allowedFormats: ["csv", "json"],
    maxRecords: 10000,
    maskPiiOnExport: true,
    auditRequired: true,
  },
  payments: {
    entityType: "payments",
    requiresApproval: true,
    minimumRole: "super_admin",
    allowedFormats: ["csv"],
    maxRecords: 5000,
    maskPiiOnExport: true,
    auditRequired: true,
  },
  audit_logs: {
    entityType: "audit_logs",
    requiresApproval: true,
    minimumRole: "super_admin",
    allowedFormats: ["json"],
    maxRecords: 50000,
    maskPiiOnExport: false,
    auditRequired: true,
  },
  analytics_member_daily: {
    entityType: "analytics_member_daily",
    requiresApproval: false,
    minimumRole: "analyst",
    allowedFormats: ["csv", "json", "parquet"],
    maxRecords: 1000000,
    maskPiiOnExport: false,
    auditRequired: true,
  },
  ai_interactions: {
    entityType: "ai_interactions",
    requiresApproval: true,
    minimumRole: "ai_engineer",
    allowedFormats: ["parquet"],
    maxRecords: 100000,
    maskPiiOnExport: true,
    auditRequired: true,
  },
};

export function canExport(
  roleId: string,
  entityType: string,
  format: "csv" | "json" | "parquet"
): { allowed: boolean; requiresApproval: boolean; reason?: string } {
  const policy = EXPORT_POLICIES[entityType];

  if (!policy) {
    return { allowed: false, requiresApproval: false, reason: "No export policy defined for this entity type" };
  }

  if (!hasPermission(roleId, entityType, "export") && !hasPermission(roleId, entityType, "admin")) {
    return { allowed: false, requiresApproval: false, reason: "Insufficient permissions for export" };
  }

  if (!policy.allowedFormats.includes(format)) {
    return {
      allowed: false,
      requiresApproval: false,
      reason: `Format "${format}" not allowed for "${entityType}" exports`,
    };
  }

  return { allowed: true, requiresApproval: policy.requiresApproval };
}

// ---------------------------------------------------------------------------
// Privacy Compliance Status
// ---------------------------------------------------------------------------

export interface PrivacyComplianceStatus {
  region: RegionCode;
  regulation: string;
  status: "compliant" | "partial" | "non_compliant" | "not_applicable";
  controls: string[];
  lastReviewedAt?: Date;
  nextReviewDue?: Date;
}

export const PRIVACY_COMPLIANCE: PrivacyComplianceStatus[] = [
  {
    region: "EU",
    regulation: "GDPR",
    status: "compliant",
    controls: [
      "consent_management",
      "data_subject_rights",
      "privacy_by_design",
      "dpo_appointed",
      "data_breach_notification",
      "privacy_impact_assessment",
      "standard_contractual_clauses",
    ],
  },
  {
    region: "NA",
    regulation: "CCPA",
    status: "compliant",
    controls: [
      "opt_out_of_sale",
      "right_to_know",
      "right_to_delete",
      "non_discrimination",
      "privacy_notice",
    ],
  },
  {
    region: "NA",
    regulation: "PIPEDA",
    status: "compliant",
    controls: [
      "consent_collection",
      "limiting_use",
      "accuracy",
      "individual_access",
      "challenging_compliance",
    ],
  },
  {
    region: "CARIB",
    regulation: "DATA_PROTECTION_ACTS",
    status: "partial",
    controls: ["consent_management", "data_subject_rights"],
  },
];

export function getComplianceStatus(region: RegionCode): PrivacyComplianceStatus[] {
  return PRIVACY_COMPLIANCE.filter((c) => c.region === region);
}

// ---------------------------------------------------------------------------
// Zero Trust Security Headers
// ---------------------------------------------------------------------------

export const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'nonce-{NONCE}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.edunancial.com; frame-ancestors 'none'",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
};

export function getSecurityHeaders(nonce: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(SECURITY_HEADERS).map(([k, v]) => [
      k,
      v.replace("{NONCE}", nonce),
    ])
  );
}
