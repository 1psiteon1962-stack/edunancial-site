import React from "react";
import { normalizePlan, type PlanCode } from "@/types/plan";

export interface AccessGateProps {
  children: React.ReactNode;
  requiredPlan?: PlanCode;
  session?: {
    user?: {
      planCode?: string | null;
    };
  };
}

const FALLBACK_PLAN_CODE: string = "starter";

export default function AccessGate({
  children,
  requiredPlan,
  session,
}: AccessGateProps) {
  // FIX: force a guaranteed string BEFORE calling normalizePlan
  const planCode: string = session?.user?.planCode ?? FALLBACK_PLAN_CODE;

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
