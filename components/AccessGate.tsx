"use client";

import { ReactNode } from "react";

type Plan =
  | "free"
  | "starter"
  | "growth"
  | "level-1"
  | "level-2"
  | "level-3";

type AccessGateProps = {
  requiredPlan?: Plan;
  currentPlan?: Plan;
  children: ReactNode;
};

const PLAN_ORDER: Record<Plan, number> = {
  free: 0,
  starter: 1,
  "level-1": 1,
  growth: 2,
  "level-2": 2,
  "level-3": 3
};

export default function AccessGate({
  requiredPlan = "free",
  currentPlan = "free",
  children
}: AccessGateProps) {

  if (PLAN_ORDER[currentPlan] < PLAN_ORDER[requiredPlan]) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <h2>Upgrade Required</h2>
        <p>This content requires the <strong>{requiredPlan}</strong> plan.</p>
      </div>
    );
  }

  return <>{children}</>;
}
