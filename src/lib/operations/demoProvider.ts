import { evaluateAlertRules, defaultAlertRules } from "@/lib/operations/alerts";
import { calculateBackupSuccessRate, createBackupExecution, recordRestoreTest, scheduleNextBackup, transitionBackupExecution, verifyBackupExecution } from "@/lib/operations/backups";
import { defaultDisasterRecoveryPolicy, defaultFailoverReadiness, defaultRunbook } from "@/lib/operations/disasterRecovery";
import { createStructuredLogEvent, filterStructuredLogs } from "@/lib/operations/logging";
import { aggregateOperationalMetrics } from "@/lib/operations/metrics";
import { buildObservabilityPanels, DemoObservabilityAdapter } from "@/lib/operations/observability";
import {
  LogRetentionPolicy,
  LogQuery,
  MetricsProviderResult,
  NotificationChannelDescriptor,
  OperationsDashboardData,
  ServiceHealth,
  StructuredLogEvent,
} from "@/lib/operations/types";

function isoOffset(minutesAgo: number) {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

const infrastructureMetrics: MetricsProviderResult = {
  providerId: "demo-infrastructure",
  providerName: "Demo infrastructure adapter",
  collectedAt: isoOffset(0),
  metrics: [
    {
      id: "system-uptime",
      label: "System uptime",
      value: 99.982,
      unit: "percent",
      status: "healthy",
      trend: "steady",
      description: "Rolling 30-day uptime across critical services.",
      target: ">= 99.95%",
    },
    {
      id: "active-users",
      label: "Active users",
      value: 18420,
      unit: "count",
      status: "healthy",
      trend: "up",
      description: "Users active in the last 15 minutes.",
    },
    {
      id: "cpu-utilization",
      label: "CPU utilization",
      value: 61,
      unit: "percent",
      status: "healthy",
      trend: "up",
      description: "Average compute utilization across application nodes.",
      target: "< 75%",
    },
    {
      id: "memory-utilization",
      label: "Memory utilization",
      value: 73,
      unit: "percent",
      status: "warning",
      trend: "up",
      description: "Average memory pressure across application nodes.",
      target: "< 70%",
    },
    {
      id: "disk-utilization",
      label: "Disk utilization",
      value: 54,
      unit: "percent",
      status: "healthy",
      trend: "steady",
      description: "Persistent volume usage across platform workloads.",
      target: "< 80%",
    },
    {
      id: "network-latency",
      label: "Network latency",
      value: 82,
      unit: "ms",
      status: "healthy",
      trend: "steady",
      description: "Cross-service median network latency.",
      target: "< 120 ms",
    },
  ],
};

const applicationMetrics: MetricsProviderResult = {
  providerId: "demo-application",
  providerName: "Demo application adapter",
  collectedAt: isoOffset(0),
  metrics: [
    {
      id: "api-availability",
      label: "API availability",
      value: 99.97,
      unit: "percent",
      status: "healthy",
      trend: "steady",
      description: "Availability for public API requests over the last 24 hours.",
      target: ">= 99.95%",
    },
    {
      id: "error-rate",
      label: "Error rate",
      value: 0.42,
      unit: "percent",
      status: "healthy",
      trend: "down",
      description: "Proportion of requests returning 5xx errors.",
      target: "< 1%",
    },
    {
      id: "background-job-health",
      label: "Background job success rate",
      value: 99.2,
      unit: "percent",
      status: "healthy",
      trend: "steady",
      description: "Successful background job completion in the last hour.",
      target: ">= 98%",
    },
    {
      id: "queue-depth",
      label: "Queue depth",
      value: 34,
      unit: "count",
      status: "healthy",
      trend: "down",
      description: "Queued jobs waiting for worker execution.",
      target: "< 100",
    },
    {
      id: "slow-query-latency",
      label: "Slow query latency",
      value: 218,
      unit: "ms",
      status: "warning",
      trend: "up",
      description: "P95 latency for monitored slow queries.",
      target: "< 500 ms",
    },
    {
      id: "failed-auth-count",
      label: "Failed authentication attempts",
      value: 14,
      unit: "count",
      status: "healthy",
      trend: "steady",
      description: "Authentication anomalies detected in the last 15 minutes.",
      target: "< 25",
    },
  ],
};

const services: ServiceHealth[] = [
  {
    id: "public-api",
    name: "Public API gateway",
    category: "api",
    status: "healthy",
    region: "us-east-1",
    uptimePercentage: 99.97,
    latencyMs: 142,
    summary: "API traffic is balanced across healthy application targets.",
    lastCheckedAt: isoOffset(1),
  },
  {
    id: "primary-database",
    name: "Primary database",
    category: "database",
    status: "warning",
    region: "us-east-1",
    uptimePercentage: 99.95,
    latencyMs: 218,
    summary: "Write latency is elevated but within slow query alert thresholds.",
    lastCheckedAt: isoOffset(2),
  },
  {
    id: "worker-queue",
    name: "Background worker queue",
    category: "queue",
    status: "healthy",
    region: "us-east-1",
    uptimePercentage: 99.99,
    latencyMs: 88,
    summary: "Queue depth and worker throughput remain within SLOs.",
    lastCheckedAt: isoOffset(1),
  },
  {
    id: "security-events",
    name: "Security event pipeline",
    category: "security",
    status: "healthy",
    region: "global",
    uptimePercentage: 99.98,
    latencyMs: 76,
    summary: "Security events are streaming into the structured log pipeline.",
    lastCheckedAt: isoOffset(1),
  },
];

const backupPolicies = [
  scheduleNextBackup(
    {
      id: "db-primary",
      resource: "Primary database",
      cadence: "hourly",
      retentionDays: 35,
      geoRedundant: true,
      pointInTimeRecovery: true,
      verificationRequired: true,
    },
    isoOffset(0),
  ),
  scheduleNextBackup(
    {
      id: "object-uploads",
      resource: "User uploads and course assets",
      cadence: "daily",
      retentionDays: 90,
      geoRedundant: true,
      pointInTimeRecovery: false,
      verificationRequired: true,
    },
    isoOffset(0),
  ),
  scheduleNextBackup(
    {
      id: "config-secrets",
      resource: "Configuration and CMS exports",
      cadence: "daily",
      retentionDays: 30,
      geoRedundant: true,
      pointInTimeRecovery: false,
      verificationRequired: true,
    },
    isoOffset(0),
  ),
];

function buildBackupExecutions() {
  const dbRun = verifyBackupExecution(
    transitionBackupExecution(
      transitionBackupExecution(createBackupExecution(backupPolicies[0], isoOffset(55)), "running", isoOffset(55)),
      "succeeded",
      isoOffset(50),
      12.4,
    ),
    "verified",
    isoOffset(47),
    "PITR restore checkpoint replay validated.",
  );

  const assetRun = recordRestoreTest(
    verifyBackupExecution(
      transitionBackupExecution(
        transitionBackupExecution(createBackupExecution(backupPolicies[1], isoOffset(1440)), "running", isoOffset(1435)),
        "succeeded",
        isoOffset(1420),
        240.7,
      ),
      "verified",
      isoOffset(1410),
      "Object manifest checksum matched source inventory.",
    ),
    "passed",
    isoOffset(1400),
    "Cross-region restore smoke test succeeded.",
  );

  const configRun = transitionBackupExecution(
    transitionBackupExecution(createBackupExecution(backupPolicies[2], isoOffset(1440)), "running", isoOffset(1438)),
    "failed",
    isoOffset(1430),
    0,
  );

  return [dbRun, assetRun, configRun];
}

const logRetention: LogRetentionPolicy = {
  policyId: "ops-default",
  hotRetentionDays: 14,
  coldRetentionDays: 365,
  archiveStorageClass: "immutable-object-archive",
  complianceNotes: [
    "Sensitive fields are redacted before logs leave the application boundary.",
    "Retention policy abstraction is configurable for cloud-specific lifecycle rules.",
  ],
};

const notificationChannels: NotificationChannelDescriptor[] = [
  { id: "email", name: "Email notifications", status: "stub", destinationType: "email" },
  { id: "sms", name: "SMS paging", status: "stub", destinationType: "sms" },
  { id: "slack", name: "Slack incident routing", status: "stub", destinationType: "slack" },
  { id: "teams", name: "Microsoft Teams routing", status: "stub", destinationType: "teams" },
];

function buildLogs(): StructuredLogEvent[] {
  return [
    createStructuredLogEvent({
      id: "log-1",
      eventType: "api-request",
      severity: "info",
      message: "GET /api/operations/dashboard completed within SLO.",
      correlationId: "req_ops_dashboard_001",
      requestId: "req_ops_dashboard_001",
      actor: { type: "service", displayName: "dashboard-api" },
      resource: { type: "route", name: "/api/operations/dashboard" },
      timestamp: isoOffset(1),
      context: { durationMs: 86, region: "us-east-1" },
    }),
    createStructuredLogEvent({
      id: "log-2",
      eventType: "authentication",
      severity: "warning",
      message: "Multiple failed authentication attempts detected for privileged account.",
      correlationId: "auth_5521",
      actor: { type: "user", displayName: "operator@example.com" },
      resource: { type: "account", name: "admin-portal" },
      timestamp: isoOffset(6),
      context: { failureCount: 7, ipAddress: "203.0.113.10" },
    }),
    createStructuredLogEvent({
      id: "log-3",
      eventType: "security",
      severity: "critical",
      message: "WAF blocked repeated credential stuffing attempts.",
      correlationId: "sec_911",
      actor: { type: "system", displayName: "waf" },
      resource: { type: "edge", name: "primary-cdn" },
      timestamp: isoOffset(9),
      context: { blockedRequests: 129, apiKey: "super-secret-demo-key" },
    }),
    createStructuredLogEvent({
      id: "log-4",
      eventType: "payment",
      severity: "error",
      message: "Payment webhook retried after upstream gateway timeout.",
      correlationId: "pay_1337",
      actor: { type: "service", displayName: "billing-worker" },
      resource: { type: "workflow", name: "payment-settlement" },
      timestamp: isoOffset(14),
      context: { attempts: 2, provider: "future-payment-adapter" },
    }),
    createStructuredLogEvent({
      id: "log-5",
      eventType: "background-job",
      severity: "info",
      message: "Backup verification workflow completed.",
      correlationId: "backup_verify_42",
      actor: { type: "service", displayName: "backup-orchestrator" },
      resource: { type: "job", name: "verify-backups" },
      timestamp: isoOffset(18),
      context: { verified: 2, failed: 1, authorization: "******" },
    }),
    createStructuredLogEvent({
      id: "log-6",
      eventType: "database-error",
      severity: "warning",
      message: "Read replica lag exceeded preferred threshold.",
      correlationId: "db_734",
      actor: { type: "service", displayName: "postgres-primary" },
      resource: { type: "database", name: "main-cluster" },
      timestamp: isoOffset(21),
      context: { replicaLagSeconds: 5 },
    }),
  ];
}

export function getOperationsDashboardData(filters: LogQuery = {}): OperationsDashboardData {
  const metrics = aggregateOperationalMetrics([infrastructureMetrics, applicationMetrics]);
  const backups = buildBackupExecutions();
  const backupSuccessRate = calculateBackupSuccessRate(backups);
  const metricsWithBackup = [
    ...metrics,
    {
      id: "backup-success-rate",
      label: "Backup success rate",
      value: backupSuccessRate,
      unit: "percent" as const,
      status: backupSuccessRate < 100 ? "warning" as const : "healthy" as const,
      trend: "steady" as const,
      description: "Successful backup runs for the most recent execution window.",
      target: "100%",
    },
  ];
  const logs = buildLogs();
  const adapter = new DemoObservabilityAdapter();
  const observabilityPanels = buildObservabilityPanels(services, logs);
  const alertHistory = evaluateAlertRules(metricsWithBackup, defaultAlertRules, isoOffset(0));

  return {
    summary: {
      providerLabel: `${infrastructureMetrics.providerName} + ${applicationMetrics.providerName}`,
      lastUpdatedAt: isoOffset(0),
      uptimePercentage: metricsWithBackup.find((metric) => metric.id === "system-uptime")?.value ?? 0,
      activeUsers: metricsWithBackup.find((metric) => metric.id === "active-users")?.value ?? 0,
      errorRatePercent: metricsWithBackup.find((metric) => metric.id === "error-rate")?.value ?? 0,
      apiAvailabilityPercent: metricsWithBackup.find((metric) => metric.id === "api-availability")?.value ?? 0,
    },
    metrics: metricsWithBackup,
    services,
    observabilityAdapters: [adapter.descriptor],
    observabilityPanels,
    logs: filterStructuredLogs(logs, filters),
    logRetention,
    alertRules: defaultAlertRules,
    alertHistory,
    notificationChannels,
    backupPolicies,
    backups,
    disasterRecovery: defaultDisasterRecoveryPolicy,
    failoverReadiness: defaultFailoverReadiness,
    runbook: defaultRunbook,
  };
}
