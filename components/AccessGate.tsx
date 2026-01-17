// components/AccessGate.tsx

import { ReactNode } from "react";
import type { RequiredPlan } from "@/types/level";

export type PlanCode = RequiredPlan;

interface AccessGateProps {
  /**
   * Required plan(s) to access the wrapped content.
   * Accepts a single plan or an array of plans.
   */
  required: PlanCode | PlanCode[];
  children: ReactNode;
}

/**
 * AccessGate
 *
 * Normalizes `required` to an array so callers may pass:
 *  - "pro"
 *  - ["pro", "elite"]
 *
 * This keeps page-level code simple and prevents type drift.
 */
export default function AccessGate({
  required,
  children,
}: AccessGateProps) {
  const requiredPlans: PlanCode[] = Array.isArray(required)
    ? required
    : [required];

  // TODO: Replace this with real auth / subscription lookup
  const userPlan: PlanCode = "free";

  const hasAccess = requiredPlans.includes(userPlan);

  if (!hasAccess) {
    return (
      <div
        style={{
          padding: 16,
          border: "1px solid #e5e5e5",
          borderRadius: 6,
          background: "#fafafa",
        }}
      >
        <strong>Upgrade required</strong>
        <p style={{ marginTop: 8 }}>
          This content requires one of the following plans:{" "}
          {requiredPlans.join(", ")}.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
