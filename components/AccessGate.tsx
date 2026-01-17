// components/AccessGate.tsx

import { ReactNode } from "react";
import type { RequiredPlan } from "@/types/level";

interface AccessGateProps {
  required?: RequiredPlan | RequiredPlan[];
  children: ReactNode;
}

/**
 * AccessGate
 * Controls visibility of content based on plan level
 */
export default function AccessGate({
  required,
  children,
}: AccessGateProps) {
  // TODO: replace with real user plan lookup
  const userPlan: RequiredPlan = "free";

  if (!required) {
    return <>{children}</>;
  }

  const requiredPlans = Array.isArray(required)
    ? required
    : [required];

  const hasAccess = requiredPlans.includes(userPlan);

  if (!hasAccess) {
    return (
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 8,
          padding: 16,
          background: "#fafafa",
        }}
      >
        <strong>Upgrade required</strong>
        <p style={{ marginTop: 8 }}>
          This content requires a higher plan.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
