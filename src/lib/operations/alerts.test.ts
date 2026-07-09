import test from "node:test";
import assert from "node:assert/strict";

import { evaluateAlertRules } from "@/lib/operations/alerts";
import { MetricSample } from "@/lib/operations/types";

test("evaluateAlertRules triggers high error rate alert when threshold is exceeded", () => {
  const metrics: MetricSample[] = [
    {
      id: "error-rate",
      label: "Error rate",
      value: 1.7,
      unit: "percent",
      status: "warning",
      trend: "up",
      description: "Synthetic test metric",
    },
  ];

  const alerts = evaluateAlertRules(metrics, [
    {
      id: "error-budget-burn",
      name: "High error rate",
      description: "Test rule",
      metricId: "error-rate",
      severity: "warning",
      threshold: 1,
      comparator: ">=",
      routeTo: ["slack-operations"],
    },
  ], "2026-07-09T00:00:00.000Z");

  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].triggered, true);
  assert.equal(alerts[0].message.includes("triggered"), true);
});
