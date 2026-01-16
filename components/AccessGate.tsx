"use client";

import { ReactNode } from "react";
import { useUser } from "@/lib/auth/useUser";
import { canAccess } from "@/lib/access/canAccess";
import { normalizePlan } from "@/lib/auth/session";
import type { PlanCode } from "@/types/plan";

type Props = {
  area: string;
  children: ReactNode;
};

export default function AccessGate({ area, children }: Props) {
  const { user, loading } = useUser();

  if (loading || !user) {
    return null;
  }

  const plan: PlanCode = normalizePlan(user.plan);

  if (!canAccess(plan, area)) {
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
