// components/AccessGate.tsx

import React from "react";
import { normalizePlan, type PlanCode } from "@/types/plan";

export interface AccessGateProps {
  children: React.ReactNode;

  // REQUIRED: matches usage everywhere
  requiredPlan: PlanCode;
}

export default function AccessGate({
  children,
  requiredPlan,
}: AccessGateProps) {
  // TEMP: until real auth/session is wired
  const currentPlan: PlanCode = normalizePlan("free");

  const allowed =
    currentPlan === requiredPlan || currentPlan !== "free";

  if (!allowed) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Upgrade Required</h2>
        <p>This content requires the {requiredPlan} plan.</p>
      </div>
    );
  }

  return <>{children}</>;
}
