"use client";

import { ReactNode } from "react";
import { useUser } from "@/lib/auth/useUser";
import { canAccess } from "@/lib/access/canAccess";
import { normalizePlan } from "@/lib/auth/session";
import type { PlanCode } from "@/lib/auth/session";

type Props = {
  required: PlanCode;
  children: ReactNode;
};

export function AccessGate({ required, children }: Props) {
  const { user, loading } = useUser();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="border p-8 mt-12 text-center">
        <h2 className="text-2xl font-bold">Sign in required</h2>
        <p>Please sign in to access this content.</p>
      </div>
    );
  }

  const plan: PlanCode = normalizePlan(user.plan);

  if (!canAccess(plan, required)) {
    return (
      <div className="border p-8 mt-12 text-center">
        <h2 className="text-2xl font-bold">Upgrade required</h2>
        <p>This feature requires a higher plan.</p>
      </div>
    );
  }

  return <>{children}</>;
}
