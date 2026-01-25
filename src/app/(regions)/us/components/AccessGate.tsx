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

export default function AccessGate({
  children,
  requiredPlan,
  session,
}: AccessGateProps) {
  // FIX: inline fallback so TS cannot complain
  const userPlan: PlanCode = normalizePlan(
    session?.user?.planCode ?? "starter"
  );

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
