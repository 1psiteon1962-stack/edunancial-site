import React from "react";
import { normalizePlan, type PlanCode } from "@/app/lib/plans";

export interface AccessGateProps {
  children: React.ReactNode;

  /**
   * Pages like app/levels/[level]/page.tsx pass:
   *   <AccessGate required={def.code}>
   */
  required?: string;

  /**
   * Other pages may pass:
   *   <AccessGate requiredPlan="pro">
   */
  requiredPlan?: PlanCode;

  session?: {
    user?: {
      planCode?: string | null;
    };
  };
}

export default function AccessGate({
  children,
  required,
  requiredPlan,
  session,
}: AccessGateProps) {
  // User plan always normalized safely
  const userPlan: PlanCode = normalizePlan(session?.user?.planCode);

  // Accept either required (string) or requiredPlan (typed)
  const gatePlan: PlanCode | null = requiredPlan
    ? requiredPlan
    : required
    ? normalizePlan(required)
    : null;

  // If no gate requirement, allow access
  if (!gatePlan) return <>{children}</>;

  // Block if user plan does not match requirement
  if (userPlan !== gatePlan) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Upgrade Required</h2>
        <p>This content requires the {gatePlan} plan.</p>
      </div>
    );
  }

  return <>{children}</>;
}
