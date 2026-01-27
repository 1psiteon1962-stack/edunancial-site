// components/AccessGate.tsx

import React from "react";
import { normalizePlan, type PlanCode } from "@/app/lib/plans";

type Props = {
  children: React.ReactNode;

  /**
   * Minimum plan required to view this content.
   * Example: "free", "starter", "pro", "enterprise"
   */
  requiredPlan: PlanCode;
};

export default function AccessGate({ children, requiredPlan }: Props) {
  // Normalize the required plan
  const planNeeded = normalizePlan(requiredPlan);

  /**
   * TEMP ACCESS LOGIC:
   * Right now we allow everything.
   * Later this will check login + subscription.
   */
  const userPlan: PlanCode = "free";

  const allowed =
    userPlan === planNeeded ||
    userPlan === "enterprise" ||
    userPlan === "pro";

  if (!allowed) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Upgrade Required</h2>
        <p>
          This content requires the <b>{planNeeded}</b> plan.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
