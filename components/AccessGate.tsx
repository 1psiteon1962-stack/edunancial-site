// components/AccessGate.tsx

import { ReactNode } from "react";
import type { RequiredPlan } from "@/types/level";

interface AccessGateProps {
  /**
   * Required plan(s) to access content.
   * Accepts a single plan string or an array.
   */
  required: RequiredPlan | RequiredPlan[];
  children: ReactNode;
}

/**
 * AccessGate
 *
 * This component is intentionally STRING-TOLERANT.
 * Pages may pass "starter", "pro", etc. directly.
 */
export default function AccessGate({
  required,
  children,
}: AccessGateProps) {
  const requiredPlans: RequiredPlan[] = Array.isArray(required)
    ? required
    : [required];

  // TODO: Replace with real auth / subscription lookup
  const userPlan: RequiredPlan = "free";

  const hasAccess =
    requiredPlans.length === 0 || requiredPlans.includes(userPlan);

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
          Required plan: {requiredPlans.join(", ")}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
