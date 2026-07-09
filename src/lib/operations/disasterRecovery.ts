import { DisasterRecoveryPolicy, FailoverReadinessItem, RunbookStep } from "@/lib/operations/types";

export const defaultDisasterRecoveryPolicy: DisasterRecoveryPolicy = {
  policyVersion: "2026.07",
  rtoMinutes: 45,
  rpoMinutes: 15,
  primaryStrategy: "Warm standby with stateless application redeploy and replicated object storage.",
  failoverStrategy: "Promote secondary region, redirect traffic through global load balancing, and validate queue drainage before write re-enable.",
  restorationValidation: [
    "Confirm health, readiness, and liveness endpoints return healthy status.",
    "Run backup restore verification and synthetic API smoke tests.",
    "Validate background job backlog, auth, and payment workflows before incident closure.",
  ],
};

export const defaultFailoverReadiness: FailoverReadinessItem[] = [
  {
    id: "traffic-management",
    title: "Global traffic management",
    owner: "Platform",
    status: "healthy",
    summary: "DNS and load balancer cutover templates are documented for blue/green and regional failover.",
  },
  {
    id: "data-replication",
    title: "Data replication posture",
    owner: "Data",
    status: "warning",
    summary: "Database PITR and object storage redundancy are ready; cross-cloud replay automation remains stubbed.",
  },
  {
    id: "incident-command",
    title: "Incident command",
    owner: "Security",
    status: "healthy",
    summary: "Escalation channels, severity matrix, and operator runbooks are stored in-repo for rehearsals.",
  },
  {
    id: "restore-validation",
    title: "Restore validation",
    owner: "Operations",
    status: "healthy",
    summary: "Backup verification and restore-test checks are modeled and exposed in the dashboard.",
  },
];

export const defaultRunbook: RunbookStep[] = [
  {
    id: "declare-incident",
    title: "Declare incident severity and freeze deployments",
    owner: "Incident commander",
    action: "Pause deploys, assign operations lead, and start the outage timeline with correlation IDs.",
  },
  {
    id: "assess-blast-radius",
    title: "Assess blast radius and protect write paths",
    owner: "Platform lead",
    action: "Check health endpoints, queue health, and database replication before toggling maintenance controls.",
  },
  {
    id: "failover-cutover",
    title: "Execute regional failover checklist",
    owner: "Infrastructure lead",
    action: "Promote standby, update traffic weights, validate secret mounts, and re-enable background workers in order.",
  },
  {
    id: "validation",
    title: "Validate restored services",
    owner: "Application lead",
    action: "Run synthetic auth, payment, and content access smoke tests plus dashboard sanity checks.",
  },
  {
    id: "closure",
    title: "Close incident and capture follow-up actions",
    owner: "Incident commander",
    action: "Publish recovery summary, assign remediations, and schedule the next restore rehearsal.",
  },
];
