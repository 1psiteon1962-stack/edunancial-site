// app/(regions)/us/components/AccessGate.tsx

import React from "react";
import { normalizePlan, type PlanCode } from "@/app/lib/plans";

export type AccessGateProps = {
  children: React.ReactNode;

  /**
   * The minimum plan required to view the content.
   */
  requiredPlan: PlanCode;

  /**
   * The user’s current plan (may be missing/null during SSR or first load).
   */
  userPlan?: string | null;
};

export default function AccessGate({
  children,
  requiredPlan,
  userPlan,
}: AccessGateProps) {
  /**
   * Normalize safely:
   * If userPlan is null/undefined, default to "free".
   */
  const normalizedUserPlan = normalizePlan(userPlan ?? "free");

  /**
   * Allow access if the user matches the required plan,
   * or is on a higher tier.
   */
  const allowed =
    normalizedUserPlan === requiredPlan ||
    normalizedUserPlan === "enterprise" ||
    (normalizedUserPlan === "pro" &&
      (requiredPlan === "free" || requiredPlan === "starter")) ||
    (normalizedUserPlan === "starter" && requiredPlan === "free");

  if (!allowed) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Upgrade Required</h2>
        <p>
          This content requires the <strong>{requiredPlan}</strong> plan.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
