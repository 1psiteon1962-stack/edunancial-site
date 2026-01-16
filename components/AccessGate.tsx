// components/AccessGate.tsx

"use client";

import { ReactNode } from "react";
import { PlanCode, PLAN_LABEL } from "../lib/plans";
import { canAccess } from "../lib/access";

interface AccessGateProps {
  required: PlanCode;
  userPlan?: PlanCode;
  children: ReactNode;
}

export default function AccessGate({
  required,
  userPlan = "free",
  children,
}: AccessGateProps) {
  if (!canAccess(userPlan, required)) {
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
          This content requires the{" "}
          <strong>{PLAN_LABEL[required]}</strong> plan or higher.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
