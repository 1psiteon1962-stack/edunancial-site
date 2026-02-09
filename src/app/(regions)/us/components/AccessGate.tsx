// src/app/(regions)/us/components/AccessGate.tsx

import React from "react";
import { normalizePlan, type PlanCode } from "@/app/lib/plans";

export type AccessGateProps = {
  children: React.ReactNode;
  userPlan?: string | null;
  requiredPlan: PlanCode;
};

export default function AccessGate({
  children,
  userPlan,
  requiredPlan,
}: AccessGateProps) {
  const normalizedUserPlan = normalizePlan(userPlan);

  const allowed =
    normalizedUserPlan === requiredPlan ||
    normalizedUserPlan === "elite" ||
    normalizedUserPlan === "enterprise";

  if (!allowed) {
    return (
      <div style={{ padding: 24 }}>
        <h3>Upgrade Required</h3>
        <p>
          This content requires the <strong>{requiredPlan}</strong> plan.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
