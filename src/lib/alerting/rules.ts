import {
  type Alert,
  type AlertRule,
  type AlertCategory,
  type AlertSeverity,
  type AlertDashboardSummary,
  type NotificationChannel,
  type NotificationPayload,
  type AlertRoutingRule,
} from "./types";

// ─── Default Alert Rules ──────────────────────────────────────────────────────

export const DEFAULT_ALERT_RULES: AlertRule[] = [
  { id: "ar-001", name: "Service Down",             category: "service_outage",          description: "Service health check failing",                severity: "critical", enabled: true, threshold: 1,   unit: "failures",  durationSeconds: 60,   channels: ["pagerduty", "slack-ops"],   silenceWindowSeconds: 300  },
  { id: "ar-002", name: "High Error Rate",          category: "high_error_rate",          description: "API error rate exceeds 5%",                   severity: "high",     enabled: true, threshold: 5,   unit: "percent",   durationSeconds: 120,  channels: ["slack-ops"],               silenceWindowSeconds: 600  },
  { id: "ar-003", name: "Backup Failure",           category: "backup_failure",           description: "Scheduled backup did not complete",           severity: "high",     enabled: true, threshold: 1,   unit: "failures",  durationSeconds: 0,    channels: ["email-ops", "slack-ops"],  silenceWindowSeconds: 86400 },
  { id: "ar-004", name: "Auth Anomaly",             category: "auth_anomaly",             description: "Unusual authentication failure rate",         severity: "high",     enabled: true, threshold: 20,  unit: "failures",  durationSeconds: 300,  channels: ["slack-security"],          silenceWindowSeconds: 3600 },
  { id: "ar-005", name: "Security Incident",        category: "security_incident",        description: "WAF or IDS triggered on suspicious activity", severity: "critical", enabled: true, threshold: 1,   unit: "events",    durationSeconds: 0,    channels: ["pagerduty", "email-security"], silenceWindowSeconds: 0 },
  { id: "ar-006", name: "CPU Exhaustion",           category: "resource_exhaustion",      description: "CPU usage > 90% for extended period",         severity: "high",     enabled: true, threshold: 90,  unit: "percent",   durationSeconds: 300,  channels: ["slack-ops"],               silenceWindowSeconds: 600  },
  { id: "ar-007", name: "Memory Exhaustion",        category: "resource_exhaustion",      description: "Memory usage > 90%",                          severity: "high",     enabled: true, threshold: 90,  unit: "percent",   durationSeconds: 300,  channels: ["slack-ops"],               silenceWindowSeconds: 600  },
  { id: "ar-008", name: "Disk Space Critical",      category: "resource_exhaustion",      description: "Disk usage > 85%",                            severity: "high",     enabled: true, threshold: 85,  unit: "percent",   durationSeconds: 0,    channels: ["slack-ops"],               silenceWindowSeconds: 3600 },
  { id: "ar-009", name: "Database Failure",         category: "database_failure",         description: "Database connection pool exhausted or down",  severity: "critical", enabled: true, threshold: 1,   unit: "failures",  durationSeconds: 30,   channels: ["pagerduty", "slack-ops"],  silenceWindowSeconds: 300  },
  { id: "ar-010", name: "High API Latency",         category: "performance_degradation",  description: "P99 latency > 1000ms",                        severity: "medium",   enabled: true, threshold: 1000,unit: "ms",        durationSeconds: 300,  channels: ["slack-ops"],               silenceWindowSeconds: 600  },
  { id: "ar-011", name: "TLS Certificate Expiry",   category: "certificate_expiry",       description: "TLS cert expires in < 14 days",               severity: "high",     enabled: true, threshold: 14,  unit: "days",      durationSeconds: 0,    channels: ["email-ops"],               silenceWindowSeconds: 86400 },
];

// ─── Demo Notification Channels ───────────────────────────────────────────────

class LoggingChannel implements NotificationChannel {
  constructor(
    public id: string,
    public name: string,
    public type: NotificationChannel["type"],
    public enabled = true
  ) {}

  async send(payload: NotificationPayload): Promise<void> {
    // In production, replace with real provider SDK call.
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info(`[ALERT CHANNEL: ${this.name}] ${payload.title} — ${payload.body}`);
    }
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

export const DEFAULT_CHANNELS: NotificationChannel[] = [
  new LoggingChannel("slack-ops",       "Slack #ops-alerts",      "slack"),
  new LoggingChannel("slack-security",  "Slack #security-alerts", "slack"),
  new LoggingChannel("email-ops",       "Ops Email",              "email"),
  new LoggingChannel("email-security",  "Security Email",         "email"),
  new LoggingChannel("pagerduty",       "PagerDuty",              "pagerduty"),
];

export const DEFAULT_ROUTING_RULES: AlertRoutingRule[] = [
  { channelId: "pagerduty",       minSeverity: "critical" },
  { channelId: "slack-ops",       minSeverity: "high" },
  { channelId: "slack-security",  minSeverity: "high", categories: ["security_incident", "auth_anomaly"] },
  { channelId: "email-ops",       minSeverity: "high", categories: ["backup_failure"] },
  { channelId: "email-security",  minSeverity: "critical", categories: ["security_incident"] },
];

// ─── Demo Alert Fixtures ───────────────────────────────────────────────────────

export function getDemoAlerts(): Alert[] {
  const now = Date.now();
  return [
    { id: "al-001", ruleId: "ar-001", ruleName: "Service Down",            category: "service_outage",         severity: "critical", status: "resolved",      message: "notification-service was unreachable for 90s", service: "notification-service", firedAt: now - 7_200_000,   resolvedAt: now - 6_900_000 },
    { id: "al-002", ruleId: "ar-002", ruleName: "High Error Rate",         category: "high_error_rate",         severity: "high",     status: "resolved",      message: "Error rate reached 8.2% on /api/auth/login",   service: "auth-service",         firedAt: now - 14_400_000,  resolvedAt: now - 13_800_000 },
    { id: "al-003", ruleId: "ar-003", ruleName: "Backup Failure",          category: "backup_failure",          severity: "high",     status: "acknowledged",  message: "Daily database backup failed — connection timeout", service: "backup-scheduler",  firedAt: now - 3_600_000,   acknowledgedAt: now - 3_000_000, acknowledgedBy: "ops@edunancial.com", value: 1 },
    { id: "al-004", ruleId: "ar-006", ruleName: "CPU Exhaustion",          category: "resource_exhaustion",     severity: "high",     status: "resolved",      message: "api-01 CPU at 94% for 6 minutes",               service: "api-01",               firedAt: now - 21_600_000,  resolvedAt: now - 21_000_000, value: 94, threshold: 90 },
    { id: "al-005", ruleId: "ar-010", ruleName: "High API Latency",        category: "performance_degradation", severity: "medium",   status: "firing",        message: "P99 latency on /api/courses spiked to 1,240ms",  service: "course-engine",        firedAt: now - 900_000,     value: 1240, threshold: 1000 },
    { id: "al-006", ruleId: "ar-004", ruleName: "Auth Anomaly",            category: "auth_anomaly",            severity: "high",     status: "resolved",      message: "28 auth failures from 192.168.1.42 in 5 minutes", service: "auth-service",        firedAt: now - 86_400_000,  resolvedAt: now - 86_100_000, value: 28, threshold: 20 },
  ];
}

export function getDemoAlertSummary(): AlertDashboardSummary {
  const alerts = getDemoAlerts();
  const firing = alerts.filter((a) => a.status === "firing");
  const byCategory = {} as Record<AlertCategory, number>;
  for (const a of alerts) {
    byCategory[a.category] = (byCategory[a.category] ?? 0) + 1;
  }
  return {
    total: alerts.length,
    firing: firing.length,
    critical: firing.filter((a) => a.severity === "critical").length,
    high: firing.filter((a) => a.severity === "high").length,
    recent: alerts.slice(0, 5),
    byCategory,
  };
}

// ─── Alert routing helper ─────────────────────────────────────────────────────

const SEVERITY_ORDER: Record<AlertSeverity, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };

export async function routeAlert(
  alert: Alert,
  channels: NotificationChannel[],
  rules: AlertRoutingRule[]
): Promise<void> {
  const payload: NotificationPayload = {
    alert,
    title: `[${alert.severity.toUpperCase()}] ${alert.ruleName}`,
    body: alert.message,
    severity: alert.severity,
  };

  for (const rule of rules) {
    if (SEVERITY_ORDER[alert.severity] < SEVERITY_ORDER[rule.minSeverity]) continue;
    if (rule.categories && !rule.categories.includes(alert.category)) continue;
    if (rule.services && !rule.services.includes(alert.service)) continue;

    const channel = channels.find((c) => c.id === rule.channelId && c.enabled);
    if (channel) {
      await channel.send(payload).catch(() => void 0);
    }
  }
}
