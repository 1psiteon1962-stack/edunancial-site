import { AlertHistoryItem, AlertRule, MetricSample } from "@/lib/operations/types";

function compareValue(value: number, comparator: AlertRule["comparator"], threshold: number) {
  switch (comparator) {
    case ">":
      return value > threshold;
    case ">=":
      return value >= threshold;
    case "<":
      return value < threshold;
    case "<=":
      return value <= threshold;
    default:
      return false;
  }
}

export const defaultAlertRules: AlertRule[] = [
  {
    id: "service-outage",
    name: "Service outage",
    description: "Escalate when API availability falls below the resilience target.",
    metricId: "api-availability",
    severity: "critical",
    threshold: 99.95,
    comparator: "<",
    routeTo: ["pagerduty", "slack-operations"],
  },
  {
    id: "error-budget-burn",
    name: "High error rate",
    description: "Escalate when the customer facing error rate exceeds budget.",
    metricId: "error-rate",
    severity: "warning",
    threshold: 1,
    comparator: ">=",
    routeTo: ["slack-operations", "teams-executive"],
  },
  {
    id: "backup-failure",
    name: "Failed backup",
    description: "Escalate if backup completion rate drops below 100%.",
    metricId: "backup-success-rate",
    severity: "critical",
    threshold: 100,
    comparator: "<",
    routeTo: ["email-infrastructure", "slack-operations"],
  },
  {
    id: "auth-anomaly",
    name: "Authentication anomaly",
    description: "Investigate if failed authentication spikes beyond threshold.",
    metricId: "failed-auth-count",
    severity: "warning",
    threshold: 25,
    comparator: ">=",
    routeTo: ["slack-security", "teams-security"],
  },
  {
    id: "slow-query",
    name: "Slow database queries",
    description: "Warn when slow query latency crosses the SLO guardrail.",
    metricId: "slow-query-latency",
    severity: "warning",
    threshold: 500,
    comparator: ">=",
    routeTo: ["slack-platform"],
  },
];

export function evaluateAlertRules(metrics: MetricSample[], rules = defaultAlertRules, now = new Date().toISOString()) {
  const metricMap = new Map(metrics.map((metric) => [metric.id, metric]));

  return rules.map<AlertHistoryItem>((rule) => {
    const metric = metricMap.get(rule.metricId);
    const observedValue = metric?.value ?? 0;
    const triggered = compareValue(observedValue, rule.comparator, rule.threshold);

    return {
      id: `${rule.id}-${now}`,
      ruleId: rule.id,
      name: rule.name,
      severity: rule.severity,
      triggered,
      observedValue,
      threshold: rule.threshold,
      message: triggered
        ? `${rule.name} triggered at ${observedValue}${metric?.unit === "percent" ? "%" : ""}.`
        : `${rule.name} is within threshold.`,
      acknowledged: false,
      triggeredAt: now,
      routeTo: rule.routeTo,
    };
  });
}
