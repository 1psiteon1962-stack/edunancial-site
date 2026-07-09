import { type DRObjectives, type FailoverConfig, type RunbookTemplate, type RecoveryChecklist } from "./types";

// ─── RTO/RPO Configuration Model ─────────────────────────────────────────────
// Customize these values for your actual SLA commitments.

export const DR_OBJECTIVES: DRObjectives[] = [
  { service: "payment-service",       rto: { service: "payment-service",       maxDowntimeMinutes: 5,   tier: "critical" }, rpo: { service: "payment-service",       maxDataLossMinutes: 1,   tier: "critical" }, testStatus: "passed", lastTestedAt: Date.now() - 86_400_000 * 30 },
  { service: "auth-service",          rto: { service: "auth-service",          maxDowntimeMinutes: 10,  tier: "critical" }, rpo: { service: "auth-service",          maxDataLossMinutes: 5,   tier: "critical" }, testStatus: "passed", lastTestedAt: Date.now() - 86_400_000 * 45 },
  { service: "api-gateway",           rto: { service: "api-gateway",           maxDowntimeMinutes: 15,  tier: "high"     }, rpo: { service: "api-gateway",           maxDataLossMinutes: 0,   tier: "high"     }, testStatus: "passed", lastTestedAt: Date.now() - 86_400_000 * 60 },
  { service: "primary-database",      rto: { service: "primary-database",      maxDowntimeMinutes: 10,  tier: "critical" }, rpo: { service: "primary-database",      maxDataLossMinutes: 5,   tier: "critical" }, testStatus: "not_tested" },
  { service: "web-frontend",          rto: { service: "web-frontend",          maxDowntimeMinutes: 30,  tier: "high"     }, rpo: { service: "web-frontend",          maxDataLossMinutes: 0,   tier: "high"     }, testStatus: "passed", lastTestedAt: Date.now() - 86_400_000 * 30 },
  { service: "course-engine",         rto: { service: "course-engine",         maxDowntimeMinutes: 60,  tier: "medium"   }, rpo: { service: "course-engine",         maxDataLossMinutes: 60,  tier: "medium"   }, testStatus: "not_tested" },
  { service: "notification-service",  rto: { service: "notification-service",  maxDowntimeMinutes: 120, tier: "low"      }, rpo: { service: "notification-service",  maxDataLossMinutes: 120, tier: "low"      }, testStatus: "not_tested" },
  { service: "search-indexer",        rto: { service: "search-indexer",        maxDowntimeMinutes: 240, tier: "low"      }, rpo: { service: "search-indexer",        maxDataLossMinutes: 1440,tier: "low"      }, testStatus: "not_tested" },
];

// ─── Failover Configuration ───────────────────────────────────────────────────

export const FAILOVER_CONFIG: FailoverConfig = {
  primaryRegion: "us-east-1",
  failoverRegions: ["us-west-2", "eu-west-1"],
  automaticFailoverEnabled: false, // set true when infra supports it
  healthCheckIntervalSeconds: 30,
  failoverThresholdFailures: 3,
  dnsFailoverEnabled: false,
  notifyOnFailover: ["ops@edunancial.com"],
};

// ─── Recovery Runbooks ────────────────────────────────────────────────────────

export const RUNBOOKS: RunbookTemplate[] = [
  {
    id: "rb-001",
    title: "Database Primary Failure",
    triggerCondition: "Primary PostgreSQL instance unreachable for > 30s",
    severity: "sev1",
    estimatedResolutionMinutes: 15,
    escalationPath: [
      { level: 1, triggerAfterMinutes: 5,  notifyRoles: ["on-call-engineer"],         channel: "pagerduty" },
      { level: 2, triggerAfterMinutes: 15, notifyRoles: ["engineering-lead", "cto"],  channel: "phone"     },
      { level: 3, triggerAfterMinutes: 30, notifyRoles: ["executive-team"],           channel: "phone"     },
    ],
    steps: [
      { order: 1, title: "Confirm failure", description: "Verify primary DB is unreachable via health check endpoint and direct connection.", commands: ["psql -h primary-db -U healthcheck -c 'SELECT 1'"], expectedOutcome: "Connection refused or timeout", onFailure: "False alarm — skip to step 5" },
      { order: 2, title: "Promote replica", description: "Promote standby replica to primary using the provider console or pg_ctl.", commands: ["pg_ctl promote -D /var/lib/postgresql/data"], expectedOutcome: "Replica accepts writes", onFailure: "Contact DBA team — manual recovery required" },
      { order: 3, title: "Update DNS/connection string", description: "Update DATABASE_URL env var to point to new primary.", commands: ["# Update secret in secrets manager", "# Restart API service for connection refresh"], expectedOutcome: "API connects to new primary", onFailure: "Manual hotfix required" },
      { order: 4, title: "Verify application", description: "Run health checks against all API endpoints.", expectedOutcome: "All health checks green", onFailure: "Escalate to engineering lead" },
      { order: 5, title: "Notify stakeholders", description: "Post incident update to status page and notify customer success.", expectedOutcome: "Status page updated", onFailure: "N/A" },
    ],
  },
  {
    id: "rb-002",
    title: "Complete Service Outage",
    triggerCondition: "All services returning 5xx for > 2 minutes",
    severity: "sev1",
    estimatedResolutionMinutes: 30,
    escalationPath: [
      { level: 1, triggerAfterMinutes: 2,  notifyRoles: ["on-call-engineer"],                channel: "pagerduty" },
      { level: 2, triggerAfterMinutes: 10, notifyRoles: ["engineering-lead", "ops-manager"],  channel: "slack"     },
      { level: 3, triggerAfterMinutes: 20, notifyRoles: ["cto", "ceo"],                       channel: "phone"     },
    ],
    steps: [
      { order: 1, title: "Triage", description: "Identify the blast radius — which services are down and what changed in the last 30 minutes.", expectedOutcome: "Root cause candidate identified", onFailure: "Engage full incident team" },
      { order: 2, title: "Rollback last deployment", description: "If a recent deployment is suspected, initiate rollback immediately.", commands: ["# Platform-specific rollback command"], expectedOutcome: "Previous stable version running", onFailure: "Investigate infrastructure layer" },
      { order: 3, title: "Check infrastructure", description: "Verify servers, load balancer, and database are responsive.", expectedOutcome: "Infrastructure healthy", onFailure: "Failover to DR region" },
      { order: 4, title: "Restore from backup", description: "If data corruption is involved, initiate point-in-time recovery.", expectedOutcome: "Data restored to last verified backup", onFailure: "Escalate to executive team" },
      { order: 5, title: "Post-incident", description: "Update status page, notify customers, schedule post-mortem within 48h.", expectedOutcome: "Communications sent, post-mortem scheduled", onFailure: "N/A" },
    ],
  },
];

// ─── Infrastructure Recovery Checklist ───────────────────────────────────────

export const RECOVERY_CHECKLISTS: RecoveryChecklist[] = [
  {
    id: "cl-infra-001",
    name: "Infrastructure Recovery Checklist",
    category: "infrastructure",
    steps: [
      { id: "s1", order: 1, owner: "DevOps",     description: "Verify all servers are reachable", estimatedMinutes: 5,  verificationCriteria: "SSH and health endpoint reachable on all nodes" },
      { id: "s2", order: 2, owner: "DevOps",     description: "Confirm load balancer health targets", estimatedMinutes: 5, verificationCriteria: "All backend targets show healthy in LB console" },
      { id: "s3", order: 3, owner: "DBA",        description: "Verify database replication", estimatedMinutes: 10, verificationCriteria: "Replication lag < 100ms, replica is current" },
      { id: "s4", order: 4, owner: "DBA",        description: "Run database integrity checks", estimatedMinutes: 20, verificationCriteria: "pg_check returns no errors" },
      { id: "s5", order: 5, owner: "Backend",    description: "Confirm all API services healthy", estimatedMinutes: 5,  verificationCriteria: "/api/health returns 200 for all services" },
      { id: "s6", order: 6, owner: "Frontend",   description: "Smoke test critical user flows", estimatedMinutes: 15, verificationCriteria: "Login, course enrollment, and payment flows succeed" },
      { id: "s7", order: 7, owner: "DevOps",     description: "Verify backup jobs running", estimatedMinutes: 5,  verificationCriteria: "Next scheduled backup shows in console" },
      { id: "s8", order: 8, owner: "Security",   description: "Review security alerts from outage window", estimatedMinutes: 10, verificationCriteria: "No suspicious activity during outage" },
      { id: "s9", order: 9, owner: "Leadership", description: "Communicate restoration to stakeholders", estimatedMinutes: 10, verificationCriteria: "Status page updated, emails sent" },
    ],
  },
];
