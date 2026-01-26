// app/(regions)/us/components/AccessGate.tsx

"use client";

import React from "react";
import { normalizePlan } from "@/app/lib/plans";
import type { PlanCode } from "@/types/plan";

export type AccessGateProps = {
  children: React.ReactNode;
  requiredPlan?: PlanCode;
  userPlan?: string | null;
};

export default function AccessGate({
  children,
  requiredPlan = "free",
  userPlan,
}: AccessGateProps) {
  const normalizedUserPlan = normalizePlan(userPlan);

  const allowed =
    normalizedUserPlan === requiredPlan ||
    normalizedUserPlan === "enterprise";

  if (!allowed) {
    return (
      <div className="p-6 border rounded bg-red-50 text-red-700">
        <h2 className="text-xl font-bold mb-2">
          Access Restricted
        </h2>
        <p>
          Your current plan (<strong>{normalizedUserPlan}</strong>) does not
          allow access to this content.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
