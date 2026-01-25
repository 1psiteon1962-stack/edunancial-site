import React from "react";
import { normalizePlan, type PlanCode, DEFAULT_PLAN_CODE } from "@/types/plan";

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
  // ABSOLUTE FIX: do NOT pass nullable into normalizePlan
  const planCode: string =
    session?.user?.planCode == null
      ? DEFAULT_PLAN_CODE
      : session.user.planCode;

  const userPlan: PlanCode = normalizePlan(planCode);

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
