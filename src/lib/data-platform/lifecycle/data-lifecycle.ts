/**
 * Data Lifecycle Management Module
 * Implements policies for data creation, updates, retention, archiving,
 * deletion, legal hold, backup, and recovery with regional privacy support.
 */

import type { LifecycleState, RegionCode } from "../enterprise-data-model";

// ---------------------------------------------------------------------------
// Retention Policy
// ---------------------------------------------------------------------------

export interface RetentionPolicy {
  entityType: string;
  policyName: string;
  activeRetentionDays: number;
  archiveRetentionDays?: number;
  deletionAfterArchiveDays?: number;
  legalHoldSupported: boolean;
  gdprApplies: boolean;
  ccpaApplies: boolean;
  regionOverrides: Partial<Record<RegionCode, { activeRetentionDays: number }>>;
  description: string;
  legalBasis?: string;
}

export const RETENTION_POLICIES: RetentionPolicy[] = [
  {
    entityType: "members",
    policyName: "Members Active Retention",
    activeRetentionDays: 3650,
    archiveRetentionDays: 365,
    deletionAfterArchiveDays: 90,
    legalHoldSupported: true,
    gdprApplies: true,
    ccpaApplies: true,
    regionOverrides: { EU: { activeRetentionDays: 2555 } },
    description: "Active member records retained 10 years. EU reduced to 7 years.",
    legalBasis: "contract",
  },
  {
    entityType: "payments",
    policyName: "Payment Records",
    activeRetentionDays: 2555,
    archiveRetentionDays: 1825,
    deletionAfterArchiveDays: 180,
    legalHoldSupported: true,
    gdprApplies: true,
    ccpaApplies: true,
    regionOverrides: {},
    description: "Payment records retained 7 years for financial compliance.",
    legalBasis: "legal_obligation",
  },
  {
    entityType: "audit_logs",
    policyName: "Audit Logs",
    activeRetentionDays: 2555,
    archiveRetentionDays: 3650,
    deletionAfterArchiveDays: undefined,
    legalHoldSupported: true,
    gdprApplies: false,
    ccpaApplies: false,
    regionOverrides: {},
    description: "Audit logs retained 7 years minimum, archived indefinitely for compliance.",
    legalBasis: "legal_obligation",
  },
  {
    entityType: "course_enrollments",
    policyName: "Course Enrollments",
    activeRetentionDays: 1825,
    archiveRetentionDays: 365,
    deletionAfterArchiveDays: 180,
    legalHoldSupported: false,
    gdprApplies: true,
    ccpaApplies: true,
    regionOverrides: {},
    description: "Enrollment records retained 5 years.",
    legalBasis: "contract",
  },
  {
    entityType: "ai_interactions",
    policyName: "AI Interactions",
    activeRetentionDays: 365,
    archiveRetentionDays: 180,
    deletionAfterArchiveDays: 90,
    legalHoldSupported: false,
    gdprApplies: true,
    ccpaApplies: true,
    regionOverrides: { EU: { activeRetentionDays: 180 } },
    description: "AI interaction data retained 1 year then archived. EU: 6 months.",
    legalBasis: "legitimate_interest",
  },
  {
    entityType: "support_tickets",
    policyName: "Support Tickets",
    activeRetentionDays: 1095,
    archiveRetentionDays: 365,
    deletionAfterArchiveDays: 90,
    legalHoldSupported: true,
    gdprApplies: true,
    ccpaApplies: true,
    regionOverrides: {},
    description: "Support tickets retained 3 years.",
    legalBasis: "contract",
  },
  {
    entityType: "calculator_sessions",
    policyName: "Calculator Sessions",
    activeRetentionDays: 90,
    archiveRetentionDays: 30,
    deletionAfterArchiveDays: 30,
    legalHoldSupported: false,
    gdprApplies: true,
    ccpaApplies: true,
    regionOverrides: {},
    description: "Calculator sessions retained 90 days.",
    legalBasis: "consent",
  },
  {
    entityType: "notifications",
    policyName: "Notifications",
    activeRetentionDays: 180,
    archiveRetentionDays: 90,
    deletionAfterArchiveDays: 90,
    legalHoldSupported: false,
    gdprApplies: true,
    ccpaApplies: true,
    regionOverrides: {},
    description: "Notification records retained 6 months.",
    legalBasis: "legitimate_interest",
  },
];

export function getRetentionPolicy(entityType: string): RetentionPolicy | undefined {
  return RETENTION_POLICIES.find((p) => p.entityType === entityType);
}

export function getEffectiveRetentionDays(
  entityType: string,
  region?: RegionCode
): number {
  const policy = getRetentionPolicy(entityType);
  if (!policy) return 365;

  if (region && policy.regionOverrides[region]) {
    return policy.regionOverrides[region]!.activeRetentionDays;
  }

  return policy.activeRetentionDays;
}

export function calculateExpiryDate(
  entityType: string,
  createdAt: Date,
  region?: RegionCode
): Date {
  const days = getEffectiveRetentionDays(entityType, region);
  const expiry = new Date(createdAt);
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}

export function isExpired(
  entityType: string,
  createdAt: Date,
  region?: RegionCode
): boolean {
  return new Date() > calculateExpiryDate(entityType, createdAt, region);
}

// ---------------------------------------------------------------------------
// Lifecycle State Machine
// ---------------------------------------------------------------------------

export type LifecycleTransition =
  | "archive"
  | "place_legal_hold"
  | "release_legal_hold"
  | "mark_pending_deletion"
  | "delete"
  | "purge"
  | "restore";

const ALLOWED_TRANSITIONS: Record<LifecycleState, LifecycleTransition[]> = {
  active: ["archive", "place_legal_hold", "mark_pending_deletion"],
  archived: ["restore", "place_legal_hold", "mark_pending_deletion"],
  legal_hold: ["release_legal_hold"],
  pending_deletion: ["delete", "place_legal_hold"],
  deleted: ["purge", "restore"],
  purged: [],
};

const TRANSITION_TARGET: Record<LifecycleTransition, LifecycleState> = {
  archive: "archived",
  place_legal_hold: "legal_hold",
  release_legal_hold: "active",
  mark_pending_deletion: "pending_deletion",
  delete: "deleted",
  purge: "purged",
  restore: "active",
};

export function canTransition(
  currentState: LifecycleState,
  transition: LifecycleTransition
): boolean {
  return ALLOWED_TRANSITIONS[currentState].includes(transition);
}

export function applyTransition(
  currentState: LifecycleState,
  transition: LifecycleTransition
): LifecycleState {
  if (!canTransition(currentState, transition)) {
    throw new Error(
      `Invalid lifecycle transition: cannot apply "${transition}" from state "${currentState}"`
    );
  }
  return TRANSITION_TARGET[transition];
}

// ---------------------------------------------------------------------------
// Legal Hold
// ---------------------------------------------------------------------------

export interface LegalHold {
  id: string;
  holdName: string;
  description?: string;
  entityType: string;
  entityIds?: string[];
  reason: string;
  legalCaseRef?: string;
  placedBy: string;
  placedAt: Date;
  expiresAt?: Date;
  releasedAt?: Date;
  status: "active" | "released" | "expired";
  region?: RegionCode;
}

export function isUnderLegalHold(
  entityId: string,
  entityType: string,
  holds: LegalHold[]
): boolean {
  const now = new Date();
  return holds.some(
    (h) =>
      h.status === "active" &&
      h.entityType === entityType &&
      (h.entityIds === undefined || h.entityIds.includes(entityId)) &&
      (h.expiresAt === undefined || h.expiresAt > now)
  );
}

// ---------------------------------------------------------------------------
// GDPR / Privacy Request Handling
// ---------------------------------------------------------------------------

export type PrivacyRequestType =
  | "access"
  | "rectification"
  | "erasure"
  | "restriction"
  | "portability"
  | "objection";

export interface PrivacyRequest {
  id: string;
  memberId: string;
  requestType: PrivacyRequestType;
  region: RegionCode;
  submittedAt: Date;
  dueBy: Date;
  completedAt?: Date;
  status: "pending" | "in_progress" | "completed" | "rejected";
  rejectionReason?: string;
  verifiedAt?: Date;
}

const GDPR_RESPONSE_DAYS: Record<PrivacyRequestType, number> = {
  access: 30,
  rectification: 30,
  erasure: 30,
  restriction: 30,
  portability: 30,
  objection: 30,
};

export function createPrivacyRequest(
  memberId: string,
  requestType: PrivacyRequestType,
  region: RegionCode
): Omit<PrivacyRequest, "id"> {
  const submittedAt = new Date();
  const dueBy = new Date(submittedAt);
  dueBy.setDate(dueBy.getDate() + GDPR_RESPONSE_DAYS[requestType]);

  return {
    memberId,
    requestType,
    region,
    submittedAt,
    dueBy,
    status: "pending",
  };
}

export function canProcessErasure(
  entityType: string,
  entityId: string,
  holds: LegalHold[]
): { canErase: boolean; reason?: string } {
  const policy = getRetentionPolicy(entityType);

  if (!policy?.gdprApplies) {
    return {
      canErase: false,
      reason: `Entity type "${entityType}" is not subject to GDPR erasure`,
    };
  }

  if (isUnderLegalHold(entityId, entityType, holds)) {
    return {
      canErase: false,
      reason: "Record is under legal hold and cannot be erased",
    };
  }

  return { canErase: true };
}

// ---------------------------------------------------------------------------
// Backup / Recovery
// ---------------------------------------------------------------------------

export interface BackupConfig {
  backupType: "full" | "incremental" | "differential";
  schedule: string;
  retentionDays: number;
  encryptionRequired: boolean;
  regions: RegionCode[];
  storageClass: "hot" | "warm" | "cold" | "archive";
}

export const BACKUP_SCHEDULES: BackupConfig[] = [
  {
    backupType: "full",
    schedule: "0 2 * * 0",
    retentionDays: 90,
    encryptionRequired: true,
    regions: ["NA", "EU", "LA", "CARIB"],
    storageClass: "cold",
  },
  {
    backupType: "incremental",
    schedule: "0 2 * * 1-6",
    retentionDays: 30,
    encryptionRequired: true,
    regions: ["NA", "EU", "LA", "CARIB"],
    storageClass: "warm",
  },
  {
    backupType: "differential",
    schedule: "0 */4 * * *",
    retentionDays: 7,
    encryptionRequired: true,
    regions: ["NA", "EU", "LA", "CARIB"],
    storageClass: "hot",
  },
];

export interface RecoveryObjective {
  rto: number;
  rpo: number;
  tier: "tier1" | "tier2" | "tier3";
  description: string;
}

export const RECOVERY_OBJECTIVES: Record<string, RecoveryObjective> = {
  "payments": { rto: 1, rpo: 0.25, tier: "tier1", description: "Payment data: 1hr RTO, 15min RPO" },
  "members": { rto: 2, rpo: 0.5, tier: "tier1", description: "Member data: 2hr RTO, 30min RPO" },
  "audit_logs": { rto: 4, rpo: 1, tier: "tier2", description: "Audit logs: 4hr RTO, 1hr RPO" },
  "courses": { rto: 8, rpo: 4, tier: "tier2", description: "Course data: 8hr RTO, 4hr RPO" },
  "ai_interactions": { rto: 24, rpo: 12, tier: "tier3", description: "AI data: 24hr RTO, 12hr RPO" },
};
