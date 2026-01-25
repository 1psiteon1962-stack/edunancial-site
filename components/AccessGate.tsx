"use client";

import React from "react";
import { normalizePlan, type PlanCode } from "@/app/lib/plans";

export type AccessGateProps = {
  children: React.ReactNode;

  // REQUIRED PROP (this is what page.tsx is passing)
  required: string;

  session?: {
    user?: {
      planCode?: string | null;
    };
  };
};

export default function AccessGate({
  children,
  required,
  session,
}: AccessGateProps) {
  // Always safe: normalizePlan must accept null/undefined
  const userPlan: PlanCode = normalizePlan(session?.user?.planCode);

  // Required plan from prop
  const requiredPlan: PlanCode = normalizePlan(required);

  if (userPlan === requiredPlan) {
    return <>{children}</>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Upgrade Required</h2>
      <p>This content requires the {requiredPlan} plan.</p>
    </div>
  );
}
