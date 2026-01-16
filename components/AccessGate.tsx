// components/AccessGate.tsx

"use client";

import { ReactNode } from "react";
import { PLANS, PlanTier } from "../lib/plans";

interface AccessGateProps {
  required: PlanTier;
  userPlan?: PlanTier;
  children: ReactNode;
}

export default function AccessGate({
  required,
  userPlan = "free",
  children,
}: AccessGateProps) {
  const requiredRank = PLANS[required].rank;
  const userRank = PLANS[userPlan].rank;

  if (userRank < requiredRank) {
    return (
      <div
        style={{
          padding: "1.5rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#fafafa",
        }}
      >
        <h3>Upgrade Required</h3>
        <p>
          This content requires the <strong>{PLANS[required].name}</strong> plan
          or higher.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
