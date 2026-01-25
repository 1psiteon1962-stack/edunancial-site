"use client";

import React from "react";
import { normalizePlan, type PlanCode } from "@/app/lib/plans";

export type AccessGateProps = {
  children: React.ReactNode;

  // FIX: required is passed from app/levels/[level]/page.tsx
  required: string;

  // Optional session (planCode can be null/undefined)
  session?: {
    user?: {
      planCode?: string | null;
    };
  };
};

export default function AccessGate({ children, required, session }: AccessGateProps) {
  // FIX: normalizePlan must accept string | null | undefined internally
  const userPlan: PlanCode = normalizePlan(session?.user?.planCode);

  // Required plan from prop
  const requiredPlan: PlanCode = normalizePlan(required);

  // Allow access if user meets requirement
  if (userPlan === requiredPlan) {
    return <>{children}</>;
  }

  // Block otherwise
  return (
    <div style={{ padding: 24 }}>
      <h2>Upgrade Required</h2>
      <p>This content requires the {requiredPlan} plan.</p>
    </div>
  );
}
