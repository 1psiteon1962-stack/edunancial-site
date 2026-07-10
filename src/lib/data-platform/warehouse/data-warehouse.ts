/**
 * Enterprise Data Warehouse Module
 * Architecture supporting analytics pipelines, reporting, BI,
 * AI training datasets, historical reporting, and data lake compatibility.
 */

import type { RegionCode } from "../enterprise-data-model";

// ---------------------------------------------------------------------------
// Warehouse Event Schema (schema-on-write events for the pipeline)
// ---------------------------------------------------------------------------

export interface WarehouseEvent {
  eventId: string;
  eventName: string;
  eventVersion: string;
  sourceEntity: string;
  sourceId: string;
  actorId?: string;
  region?: string;
  payload: Record<string, unknown>;
  ingestedAt: Date;
  processedAt?: Date;
  isProcessed: boolean;
  batchId?: string;
}

export type WarehouseEventName =
  | "member.created"
  | "member.updated"
  | "member.deleted"
  | "membership.created"
  | "membership.cancelled"
  | "membership.renewed"
  | "payment.completed"
  | "payment.refunded"
  | "payment.failed"
  | "course.enrollment.created"
  | "course.enrollment.completed"
  | "lesson.progress.updated"
  | "certificate.issued"
  | "support.ticket.created"
  | "support.ticket.resolved"
  | "ai.interaction.completed"
  | "blog.article.published"
  | "notification.sent"
  | "notification.delivered";

export function buildWarehouseEvent(
  eventName: WarehouseEventName,
  sourceEntity: string,
  sourceId: string,
  payload: Record<string, unknown>,
  options?: {
    actorId?: string;
    region?: string;
    eventVersion?: string;
  }
): Omit<WarehouseEvent, "eventId" | "ingestedAt"> {
  return {
    eventName,
    eventVersion: options?.eventVersion ?? "1.0",
    sourceEntity,
    sourceId,
    actorId: options?.actorId,
    region: options?.region,
    payload,
    isProcessed: false,
  };
}

// ---------------------------------------------------------------------------
// Analytics Aggregates (TypeScript mirrors of DB views)
// ---------------------------------------------------------------------------

export interface MemberDailyAggregate {
  reportDate: string;
  region: string;
  newRegistrations: number;
  activeMembers: number;
  churnedMembers: number;
  tierFree: number;
  tierStarter: number;
  tierProfessional: number;
  tierEnterprise: number;
  tierLifetime: number;
  computedAt: Date;
}

export interface RevenueDailyAggregate {
  reportDate: string;
  region: string;
  currency: string;
  grossRevenue: number;
  netRevenue: number;
  refunds: number;
  transactionCount: number;
  newSubscriptions: number;
  renewals: number;
  cancellations: number;
  computedAt: Date;
}

export interface CourseDailyAggregate {
  reportDate: string;
  courseId: string;
  newEnrollments: number;
  completions: number;
  activeLearners: number;
  avgProgressPercent?: number;
  totalWatchTimeSeconds: number;
  certificatesIssued: number;
  computedAt: Date;
}

// ---------------------------------------------------------------------------
// BI Report Definitions
// ---------------------------------------------------------------------------

export interface BiReportDefinition {
  reportId: string;
  reportName: string;
  description: string;
  category: "member" | "revenue" | "learning" | "support" | "ai" | "executive";
  sourceEntities: string[];
  refreshSchedule: string;
  requiredPermissions: string[];
  regionScoped: boolean;
  outputFormats: ("json" | "csv" | "parquet" | "pdf")[];
}

export const BI_REPORTS: BiReportDefinition[] = [
  {
    reportId: "RPT-001",
    reportName: "Member Growth Report",
    description: "Daily/weekly/monthly member registration and churn metrics by region",
    category: "member",
    sourceEntities: ["analytics_member_daily", "memberships"],
    refreshSchedule: "0 6 * * *",
    requiredPermissions: ["analytics.read", "members.read"],
    regionScoped: true,
    outputFormats: ["json", "csv", "pdf"],
  },
  {
    reportId: "RPT-002",
    reportName: "Revenue Dashboard",
    description: "Gross and net revenue, refunds, subscription metrics by region and currency",
    category: "revenue",
    sourceEntities: ["analytics_revenue_daily", "payments", "memberships"],
    refreshSchedule: "0 6 * * *",
    requiredPermissions: ["analytics.read", "payments.read"],
    regionScoped: true,
    outputFormats: ["json", "csv", "pdf"],
  },
  {
    reportId: "RPT-003",
    reportName: "Course Engagement Report",
    description: "Enrollment, completion, watch time, and certificate metrics per course",
    category: "learning",
    sourceEntities: ["analytics_course_daily", "course_enrollments", "certificates"],
    refreshSchedule: "0 6 * * *",
    requiredPermissions: ["analytics.read", "courses.read"],
    regionScoped: false,
    outputFormats: ["json", "csv"],
  },
  {
    reportId: "RPT-004",
    reportName: "Support Operations Report",
    description: "Ticket volume, resolution time, escalation rate, satisfaction scores",
    category: "support",
    sourceEntities: ["support_tickets"],
    refreshSchedule: "0 6 * * *",
    requiredPermissions: ["analytics.read", "support.read"],
    regionScoped: true,
    outputFormats: ["json", "csv"],
  },
  {
    reportId: "RPT-005",
    reportName: "AI Interaction Analytics",
    description: "AI model usage, interaction types, feedback scores, error rates",
    category: "ai",
    sourceEntities: ["ai_interactions"],
    refreshSchedule: "0 6 * * *",
    requiredPermissions: ["analytics.read", "ai.read"],
    regionScoped: false,
    outputFormats: ["json", "parquet"],
  },
  {
    reportId: "RPT-006",
    reportName: "Executive Summary",
    description: "Cross-domain KPIs for C-level and board reporting",
    category: "executive",
    sourceEntities: ["analytics_member_daily", "analytics_revenue_daily", "analytics_course_daily"],
    refreshSchedule: "0 5 * * 1",
    requiredPermissions: ["analytics.executive"],
    regionScoped: false,
    outputFormats: ["pdf", "json"],
  },
];

export function getReportsByCategory(
  category: BiReportDefinition["category"]
): BiReportDefinition[] {
  return BI_REPORTS.filter((r) => r.category === category);
}

// ---------------------------------------------------------------------------
// AI Training Dataset Configuration
// ---------------------------------------------------------------------------

export interface AiTrainingDatasetConfig {
  datasetName: string;
  trainingPurpose: string;
  entityTypes: string[];
  anonymizationMethod: "pseudonymization" | "generalization" | "suppression" | "aggregation";
  privacyCompliant: boolean;
  regionScope: RegionCode[];
  sensitiveFieldsExcluded: string[];
  minimumRecordCount: number;
  refreshSchedule: string;
  approvalRequired: boolean;
}

export const AI_TRAINING_DATASETS: AiTrainingDatasetConfig[] = [
  {
    datasetName: "course-recommendation-v1",
    trainingPurpose: "recommendation",
    entityTypes: ["course_enrollments", "lesson_progress", "courses"],
    anonymizationMethod: "pseudonymization",
    privacyCompliant: true,
    regionScope: ["NA", "EU", "LA", "CARIB"],
    sensitiveFieldsExcluded: ["memberId", "email"],
    minimumRecordCount: 10000,
    refreshSchedule: "0 3 * * 0",
    approvalRequired: true,
  },
  {
    datasetName: "learning-outcome-prediction-v1",
    trainingPurpose: "prediction",
    entityTypes: ["course_enrollments", "lesson_progress", "certificates"],
    anonymizationMethod: "pseudonymization",
    privacyCompliant: true,
    regionScope: ["NA", "EU", "LA"],
    sensitiveFieldsExcluded: ["memberId", "studentName", "email"],
    minimumRecordCount: 5000,
    refreshSchedule: "0 3 * * 0",
    approvalRequired: true,
  },
  {
    datasetName: "financial-calculator-patterns-v1",
    trainingPurpose: "personalization",
    entityTypes: ["calculator_sessions"],
    anonymizationMethod: "generalization",
    privacyCompliant: true,
    regionScope: ["NA", "LA", "CARIB"],
    sensitiveFieldsExcluded: ["memberId", "inputData", "resultData"],
    minimumRecordCount: 2000,
    refreshSchedule: "0 3 1 * *",
    approvalRequired: true,
  },
  {
    datasetName: "support-nlp-corpus-v1",
    trainingPurpose: "nlp",
    entityTypes: ["support_tickets", "support_ticket_messages"],
    anonymizationMethod: "suppression",
    privacyCompliant: true,
    regionScope: ["NA"],
    sensitiveFieldsExcluded: ["memberId", "description", "body"],
    minimumRecordCount: 1000,
    refreshSchedule: "0 3 1 * *",
    approvalRequired: true,
  },
];

export function getDatasetConfig(datasetName: string): AiTrainingDatasetConfig | undefined {
  return AI_TRAINING_DATASETS.find((d) => d.datasetName === datasetName);
}

// ---------------------------------------------------------------------------
// Data Pipeline Definition
// ---------------------------------------------------------------------------

export interface PipelineDefinition {
  pipelineId: string;
  pipelineName: string;
  pipelineType: "etl" | "elt" | "streaming" | "batch";
  sourceEntities: string[];
  targetEntities: string[];
  transformations: string[];
  schedule?: string;
  slaMinutes: number;
  alertOnFailure: boolean;
  retryAttempts: number;
}

export const ANALYTICS_PIPELINES: PipelineDefinition[] = [
  {
    pipelineId: "PIPE-001",
    pipelineName: "Member Daily Aggregation",
    pipelineType: "batch",
    sourceEntities: ["members", "memberships"],
    targetEntities: ["analytics_member_daily"],
    transformations: ["group_by_region", "count_by_tier", "churn_calc"],
    schedule: "5 1 * * *",
    slaMinutes: 30,
    alertOnFailure: true,
    retryAttempts: 3,
  },
  {
    pipelineId: "PIPE-002",
    pipelineName: "Revenue Daily Aggregation",
    pipelineType: "batch",
    sourceEntities: ["payments"],
    targetEntities: ["analytics_revenue_daily"],
    transformations: ["group_by_region_currency", "sum_amounts", "count_transactions"],
    schedule: "5 1 * * *",
    slaMinutes: 30,
    alertOnFailure: true,
    retryAttempts: 3,
  },
  {
    pipelineId: "PIPE-003",
    pipelineName: "Course Engagement Aggregation",
    pipelineType: "batch",
    sourceEntities: ["course_enrollments", "lesson_progress", "certificates"],
    targetEntities: ["analytics_course_daily"],
    transformations: ["group_by_course", "sum_watch_time", "count_completions"],
    schedule: "10 1 * * *",
    slaMinutes: 45,
    alertOnFailure: true,
    retryAttempts: 3,
  },
  {
    pipelineId: "PIPE-004",
    pipelineName: "Warehouse Event Processor",
    pipelineType: "streaming",
    sourceEntities: ["warehouse_events"],
    targetEntities: ["analytics_member_daily", "analytics_revenue_daily", "analytics_course_daily"],
    transformations: ["event_routing", "payload_normalization", "deduplication"],
    slaMinutes: 5,
    alertOnFailure: true,
    retryAttempts: 5,
  },
  {
    pipelineId: "PIPE-005",
    pipelineName: "AI Training Dataset Refresh",
    pipelineType: "batch",
    sourceEntities: ["course_enrollments", "lesson_progress", "ai_interactions"],
    targetEntities: ["ai_dataset_registry"],
    transformations: ["anonymize", "aggregate", "export_parquet"],
    schedule: "0 3 * * 0",
    slaMinutes: 120,
    alertOnFailure: true,
    retryAttempts: 2,
  },
];
