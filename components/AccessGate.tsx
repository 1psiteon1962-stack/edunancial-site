"use client";

import type { ReactNode } from "react";
import { normalizePlan } from "@/types/plan";
import type { PlanCode } from "@/types/plan";
import { canAccess } from "@/lib/access/canAccess";
import { useUser } from "@/lib/auth/useUser";

interface AccessGateProps {
  required?: PlanCode | PlanCode[];
  children: ReactNode;
}

function AccessGate({ required, children }: AccessGateProps) {
  const { user } = useUser();

  const userPlan: PlanCode = normalizePlan(user?.planCode);

  if (!required) {
    return <>{children}</>;
  }

  const allowed: readonly PlanCode[] = Array.isArray(required)
    ? required
    : [required];

  if (!canAccess(userPlan, allowed)) {
    return null;
  }

  return <>{children}</>;
}

export default AccessGate;
export { AccessGate };
