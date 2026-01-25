"use client";

import React from "react";
import { normalizePlan, type PlanCode } from "@/app/lib/plans";

export type AccessGateProps = {
  children: React.ReactNode;

  // SUPPORT BOTH PROP NAMES USED ACROSS THE APP
  required?: string;
  requiredPlan?: string;

  session?: {
    user?: {
      planCode?: string | null;
    };
  };
};

export default function AccessGate({
  children,
  required,
  requiredPlan,
  session,
}: AccessGateProps) {
  // Accept either prop name
  const needed = requiredPlan ?? required ?? "free";

  // Always safe normalize
  const userPlan: PlanCode = normalizePlan(session?.user?.planCode);
  const gatePlan: PlanCode = normalizePlan(needed);

  // Allow access if user meets requirement
  if (userPlan === gatePlan) {
    return <>{children}</>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Upgrade Required</h2>
      <p>This content requires the {gatePlan} plan.</p>
    </div>
  );
}
