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

const FALLBACK_PLAN: PlanCode = "starter";

export default function AccessGate({
  children,
  requiredPlan,
  session,
}: AccessGateProps) {
  // FIX: force a real string BEFORE calling normalizePlan
  const rawPlanCode: string = session?.user?.planCode ?? FALLBACK_PLAN;

  const userPlan: PlanCode = normalizePlan(rawPlanCode);

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
