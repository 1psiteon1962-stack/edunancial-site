"use client";

import { ReactNode } from "react";
import { useSession } from "@/lib/auth/useSession";
import { canAccess } from "@/lib/access/canAccess";
import { normalizePlan } from "@/types/plan";
import type { PlanCode } from "@/types/plan";

interface AccessGateProps {
  required?: PlanCode | PlanCode[];
  children: ReactNode;
}

export function AccessGate({ required, children }: AccessGateProps) {
  const { session } = useSession();

  // session may be null during load
  const userPlan: PlanCode = normalizePlan(session?.user?.planCode);

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
