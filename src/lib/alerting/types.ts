// ─── Alerting Framework Types ─────────────────────────────────────────────────

export type AlertSeverity = "critical" | "high" | "medium" | "low" | "info";
export type AlertStatus = "firing" | "resolved" | "acknowledged" | "silenced";
export type AlertCategory =
  | "service_outage"
  | "high_error_rate"
  | "backup_failure"
  | "auth_anomaly"
  | "security_incident"
  | "resource_exhaustion"
  | "database_failure"
  | "performance_degradation"
  | "certificate_expiry";

export interface AlertRule {
  id: string;
  name: string;
  category: AlertCategory;
  description: string;
  enabled: boolean;
  severity: AlertSeverity;
  /** Threshold value that triggers the alert */
  threshold: number;
  /** Unit of the threshold (e.g., "percent", "ms", "count") */
  unit: string;
  /** Duration in seconds the condition must persist before firing */
  durationSeconds: number;
  /** Notification channels to route this alert to */
  channels: string[];
  /** Silence window in seconds — no re-firing within this window */
  silenceWindowSeconds: number;
}

export interface Alert {
  id: string;
  ruleId: string;
  ruleName: string;
  category: AlertCategory;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  service: string;
  firedAt: number;
  resolvedAt?: number;
  acknowledgedAt?: number;
  acknowledgedBy?: string;
  value?: number;
  threshold?: number;
  metadata?: Record<string, unknown>;
}

// ─── Notification Channel Interface (extension point) ─────────────────────────

export interface NotificationPayload {
  alert: Alert;
  title: string;
  body: string;
  severity: AlertSeverity;
}

export interface NotificationChannel {
  id: string;
  name: string;
  type: "email" | "sms" | "slack" | "msteams" | "pagerduty" | "webhook";
  enabled: boolean;
  send(payload: NotificationPayload): Promise<void>;
  healthCheck(): Promise<boolean>;
}

export interface AlertRoutingRule {
  channelId: string;
  minSeverity: AlertSeverity;
  categories?: AlertCategory[];
  services?: string[];
}

export interface AlertDashboardSummary {
  total: number;
  firing: number;
  critical: number;
  high: number;
  recent: Alert[];
  byCategory: Record<AlertCategory, number>;
}
