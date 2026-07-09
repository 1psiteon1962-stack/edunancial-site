// ─── Disaster Recovery Types & Framework ─────────────────────────────────────

export type IncidentSeverity = "sev1" | "sev2" | "sev3" | "sev4";
export type IncidentStatus = "open" | "investigating" | "mitigating" | "resolved" | "post-mortem";

export interface RTOConfig {
  /** Recovery Time Objective in minutes — max allowed downtime */
  maxDowntimeMinutes: number;
  tier: "critical" | "high" | "medium" | "low";
  service: string;
}

export interface RPOConfig {
  /** Recovery Point Objective in minutes — max acceptable data loss */
  maxDataLossMinutes: number;
  tier: "critical" | "high" | "medium" | "low";
  service: string;
}

export interface DRObjectives {
  service: string;
  rto: RTOConfig;
  rpo: RPOConfig;
  lastTestedAt?: number;
  testStatus?: "passed" | "failed" | "not_tested";
}

export interface FailoverConfig {
  primaryRegion: string;
  failoverRegions: string[];
  automaticFailoverEnabled: boolean;
  healthCheckIntervalSeconds: number;
  failoverThresholdFailures: number;
  dnsFailoverEnabled: boolean;
  notifyOnFailover: string[]; // channels/emails
}

export interface IncidentRecord {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedServices: string[];
  startedAt: number;
  detectedAt: number;
  resolvedAt?: number;
  incidentCommander?: string;
  postMortemUrl?: string;
  timeline: IncidentTimelineEntry[];
  actionItems: ActionItem[];
}

export interface IncidentTimelineEntry {
  timestamp: number;
  author: string;
  action: string;
  details?: string;
}

export interface ActionItem {
  id: string;
  description: string;
  owner: string;
  dueAt?: number;
  status: "open" | "in_progress" | "completed";
  priority: "critical" | "high" | "medium" | "low";
}

export interface RecoveryChecklist {
  id: string;
  name: string;
  category: "infrastructure" | "database" | "application" | "networking" | "communications";
  steps: ChecklistStep[];
}

export interface ChecklistStep {
  id: string;
  order: number;
  description: string;
  owner: string;
  estimatedMinutes: number;
  commands?: string[];
  dependencies?: string[]; // step ids that must complete first
  verificationCriteria: string;
}

export interface RunbookTemplate {
  id: string;
  title: string;
  triggerCondition: string;
  severity: IncidentSeverity;
  estimatedResolutionMinutes: number;
  steps: RunbookStep[];
  escalationPath: EscalationLevel[];
}

export interface RunbookStep {
  order: number;
  title: string;
  description: string;
  commands?: string[];
  expectedOutcome: string;
  onFailure: string;
}

export interface EscalationLevel {
  level: number;
  triggerAfterMinutes: number;
  notifyRoles: string[];
  channel: "slack" | "pagerduty" | "email" | "phone";
}
