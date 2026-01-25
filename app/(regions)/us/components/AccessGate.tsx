import React from "react";
import { normalizePlan, type PlanCode } from "@/app/lib/plans";

export interface AccessGateProps {
  children: React.ReactNode;

  // REQUIRED FIX: allow <AccessGate required="..." />
  required?: string;

  // Also allow the older typed form
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
  // Always normalize safely (normalizePlan must accept undefined/null)
  const userPlan: PlanCode = normalizePlan(session?.user?.planCode);

  // Accept either prop name
  const gatePlan: PlanCode | null = requiredPlan
    ? requiredPlan
    : required
    ? normalizePlan(required)
    : null;

  // No requirement = allow access
  if (!gatePlan) return <>{children}</>;

  // Block if user plan does not meet requirement
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
