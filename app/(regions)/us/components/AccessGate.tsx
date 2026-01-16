"use client";

import React from "react";
import { useUser } from "@/lib/auth/useUser";
import { canAccess } from "@/lib/access/canAccess";
import { normalizePlan } from "@/types/plan";
import type { PlanCode } from "@/types/plan";

type Props = {
  required: PlanCode;
  children: React.ReactNode;
};

const SAFE_PLANS: readonly PlanCode[] = [
  "free",
  "starter",
  "founder",
  "pro",
  "elite",
  "enterprise",
] as const;

/**
 * Coerce any unknown value into a safe PlanCode.
 * This function is the ONLY place where unknown → PlanCode happens.
 */
function coercePlan(plan: unknown): PlanCode {
  if (typeof plan !== "string") {
    return "free";
  }

  const normalized = normalizePlan(plan);

  if (SAFE_PLANS.includes(normalized)) {
    return normalized;
  }

  return "free";
}

export function AccessGate({ required, children }: Props) {
  const { user, loading } = useUser();

  if (loading) return null;

  const plan: PlanCode = coercePlan(user?.plan);

  if (!canAccess(plan, required)) {
    return null;
  }

  return <>{children}</>;
}

export default AccessGate;
