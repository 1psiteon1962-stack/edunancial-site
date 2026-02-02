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
  const normalizedUserPlan: PlanCode = normalizePlan(userPlan ?? "free");

  const allowed =
    normalizedUserPlan === requiredPlan ||
    normalizedUserPlan === "elite" ||
    normalizedUserPlan === "enterprise";

  if (!allowed) {
    return (
      <div style={{ padding: 32 }}>
        <h2>Upgrade Required</h2>
        <p>
          This content requires the <strong>{requiredPlan}</strong> plan.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
