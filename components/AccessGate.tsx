"use client";

import React from "react";
import { normalizePlan, type PlanCode } from "@/app/lib/plans";

export type AccessGateProps = {
  children: React.ReactNode;
  requiredPlan: PlanCode;
  userPlan?: string | null;
};

export default function AccessGate({
  children,
  requiredPlan,
  userPlan,
}: AccessGateProps) {
  // Always normalize safely
  const normalizedUserPlan: PlanCode = normalizePlan(userPlan ?? "free");

  // Access rules: allow if user meets or exceeds requirement
  const allowed =
    normalizedUserPlan === requiredPlan ||
    normalizedUserPlan === "enterprise" ||
    normalizedUserPlan === "elite" ||
    normalizedUserPlan === "pro";

  if (!allowed) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Upgrade Required</h2>
        <p>
          This content requires the <strong>{requiredPlan}</strong> plan.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
