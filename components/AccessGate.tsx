"use client";

import { ReactNode } from "react";
import { useUser } from "@/lib/auth/useUser";
import { canAccess } from "@/lib/access/canAccess";
import type { PlanCode } from "@/types/plan";

type Props = {
  area: string;
  requiredPlan: PlanCode;
  children: ReactNode;
};

export default function AccessGate({
  area,
  requiredPlan,
  children,
}: Props) {
  const { user, loading } = useUser();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="border p-8 mt-12 text-center">
        <h2 className="text-2xl font-bold">Login Required</h2>
        <p className="mt-4">
          You must be logged in to access this section.
        </p>
      </div>
    );
  }

  // 🔒 NORMALIZE SESSION PLAN (FREE | FOUNDER | BUILDER → free | founder | builder)
  const normalizedPlan = user.plan.toLowerCase() as PlanCode;

  if (!canAccess(normalizedPlan, area)) {
    return (
      <div className="border p-8 mt-12 text-center">
        <h2 className="text-2xl font-bold">Upgrade Required</h2>
        <p className="mt-4">
          Your current plan does not grant access to this section.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
