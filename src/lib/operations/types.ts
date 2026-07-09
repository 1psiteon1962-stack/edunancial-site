export type HealthStatus = "healthy" | "warning" | "critical";
export type AlertSeverity = "info" | "warning" | "critical";
export type LogSeverity = "info" | "warning" | "error" | "critical";
export type MetricUnit = "percent" | "ms" | "count" | "seconds" | "gb" | "mbps";
export type MetricTrend = "up" | "down" | "steady";
export type BackupCadence = "hourly" | "daily" | "weekly";
export type BackupExecutionStatus = "scheduled" | "running" | "succeeded" | "failed";
export type VerificationStatus = "pending" | "verified" | "failed";
export type RestoreTestStatus = "pending" | "passed" | "failed";

export interface MetricSample {
  id: string;
  label: string;
  value: number;
  unit: MetricUnit;
  status: HealthStatus;
  trend: MetricTrend;
  description: string;
  target?: string;
}

export interface MetricsProviderResult {
  providerId: string;
  providerName: string;
  collectedAt: string;
  metrics: MetricSample[];
}

export interface ServiceHealth {
  id: string;
  name: string;
  category: "api" | "database" | "queue" | "worker" | "storage" | "network" | "security";
  status: HealthStatus;
  region: string;
  uptimePercentage: number;
  latencyMs: number;
  summary: string;
  lastCheckedAt: string;
}

export interface InstrumentationAdapterDescriptor {
  id: string;
  name: string;
  status: "demo" | "ready";
  capabilities: string[];
}

export interface ObservabilityInsightPanel {
  id: string;
  title: string;
  status: HealthStatus;
  summary: string;
  actions: string[];
}

export interface LogEventActor {
  id?: string;
  type: "system" | "user" | "service" | "admin";
  displayName: string;
}

export interface LogEventResource {
  id?: string;
  type: string;
  name: string;
}

export interface StructuredLogEvent {
  id: string;
  schemaVersion: "1.0";
  eventType:
    | "application"
    | "authentication"
    | "administrative"
    | "security"
    | "payment"
    | "background-job"
    | "api-request"
    | "database-error";
  severity: LogSeverity;
  message: string;
  correlationId: string;
  requestId?: string;
  actor?: LogEventActor;
  resource?: LogEventResource;
  timestamp: string;
  context: Record<string, unknown>;
  redactedFields: string[];
}

export interface LogQuery {
  query?: string;
  severity?: LogSeverity | "all";
  eventType?: StructuredLogEvent["eventType"] | "all";
}

export interface LogRetentionPolicy {
  policyId: string;
  hotRetentionDays: number;
  coldRetentionDays: number;
  archiveStorageClass: string;
  complianceNotes: string[];
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metricId: string;
  severity: AlertSeverity;
  threshold: number;
  comparator: ">=" | ">" | "<=" | "<";
  routeTo: string[];
}

export interface AlertHistoryItem {
  id: string;
  ruleId: string;
  name: string;
  severity: AlertSeverity;
  triggered: boolean;
  observedValue: number;
  threshold: number;
  message: string;
  acknowledged: boolean;
  triggeredAt: string;
  routeTo: string[];
}

export interface NotificationChannelDescriptor {
  id: string;
  name: string;
  status: "stub" | "ready";
  destinationType: "email" | "sms" | "slack" | "teams";
}

export interface BackupPolicy {
  id: string;
  resource: string;
  cadence: BackupCadence;
  retentionDays: number;
  geoRedundant: boolean;
  pointInTimeRecovery: boolean;
  verificationRequired: boolean;
  nextScheduledAt: string;
}

export interface BackupVerification {
  status: VerificationStatus;
  checkedAt?: string;
  notes?: string;
}

export interface RestoreTest {
  status: RestoreTestStatus;
  testedAt?: string;
  notes?: string;
}

export interface BackupExecution {
  id: string;
  policyId: string;
  resource: string;
  scheduledFor: string;
  startedAt?: string;
  completedAt?: string;
  status: BackupExecutionStatus;
  location: string;
  sizeGb: number;
  verification: BackupVerification;
  restoreTest: RestoreTest;
}

export interface DisasterRecoveryPolicy {
  policyVersion: string;
  rtoMinutes: number;
  rpoMinutes: number;
  primaryStrategy: string;
  failoverStrategy: string;
  restorationValidation: string[];
}

export interface FailoverReadinessItem {
  id: string;
  title: string;
  owner: string;
  status: HealthStatus;
  summary: string;
}

export interface RunbookStep {
  id: string;
  title: string;
  owner: string;
  action: string;
}

export interface DashboardSummary {
  providerLabel: string;
  lastUpdatedAt: string;
  uptimePercentage: number;
  activeUsers: number;
  errorRatePercent: number;
  apiAvailabilityPercent: number;
}

export interface OperationsDashboardData {
  summary: DashboardSummary;
  metrics: MetricSample[];
  services: ServiceHealth[];
  observabilityAdapters: InstrumentationAdapterDescriptor[];
  observabilityPanels: ObservabilityInsightPanel[];
  logs: StructuredLogEvent[];
  logRetention: LogRetentionPolicy;
  alertRules: AlertRule[];
  alertHistory: AlertHistoryItem[];
  notificationChannels: NotificationChannelDescriptor[];
  backupPolicies: BackupPolicy[];
  backups: BackupExecution[];
  disasterRecovery: DisasterRecoveryPolicy;
  failoverReadiness: FailoverReadinessItem[];
  runbook: RunbookStep[];
}
