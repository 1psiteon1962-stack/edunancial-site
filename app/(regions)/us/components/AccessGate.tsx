"use client";

import { ReactNode } from "react";
import { useUser } from "@/lib/auth/useUser";
import { canAccess } from "@/lib/access/canAccess";
import { normalizePlan } from "@/types/plan";
import type { PlanCode } from "@/types/plan";

type Props = {
  children: ReactNode;
};

const SAFE_PLANS: readonly PlanCode[] = [
  "FREE",
  "BASIC",
  "PRO",
  "ENTERPRISE",
];

export default function AccessGate({ children }: Props) {
  const user = useUser();

  const plan: PlanCode = normalizePlan(user?.plan);

  if (!canAccess(plan, SAFE_PLANS)) {
    return null;
  }

  return <>{children}</>;
}
