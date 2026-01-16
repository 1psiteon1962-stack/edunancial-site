"use client";

import { ReactNode } from "react";
import { useUser } from "@/lib/auth/useUser";
import { canAccess } from "@/lib/access/canAccess";
import { normalizePlan, type PlanCode } from "@/types/plan";

type Props = {
  required: PlanCode;
  children: ReactNode;
};

export function AccessGate({ required, children }: Props) {
  const { plan } = useUser();

  const userPlan = normalizePlan(plan);

  if (!canAccess(userPlan, required)) {
    return null;
  }

  return <>{children}</>;
}
