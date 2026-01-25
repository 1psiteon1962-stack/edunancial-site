import React from "react";
import { normalizePlan, type PlanCode } from "@/app/lib/plans";

export interface AccessGateProps {
  children: React.ReactNode;
  requiredPlan?: PlanCode;
  session?: {
    user?: {
      planCode?: string | null;
    };
  };
}

export default function AccessGate({
  children,
  requiredPlan,
  session,
}: AccessGateProps) {
  // FIXED: normalizePlan now accepts null/undefined safely
  const userPlan: PlanCode = normalizePlan(session?.user?.planCode);

  if (!requiredPlan) return <>{children}</>;

  if (userPlan !== requiredPlan) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Upgrade Required</h2>
        <p>This content requires the {requiredPlan} plan.</p>
      </div>
    );
  }

  return <>{children}</>;
}
