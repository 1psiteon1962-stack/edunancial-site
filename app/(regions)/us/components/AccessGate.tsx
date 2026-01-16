"use client";

import { useUser } from "@/lib/auth/useUser";
import { canAccess } from "@/lib/access/canAccess";
import { normalizePlan } from "@/types/plan";
import type { PlanCode } from "@/types/plan";

type Props = {
  required: PlanCode;
  children: React.ReactNode;
};

const SAFE_PLANS: PlanCode[] = [
  "free",
  "pro",
  "enterprise",
  "elite",
  "founder",
];

function coercePlan(plan: unknown): PlanCode {
  const normalized = normalizePlan(plan);
  if (SAFE_PLANS.includes(normalized)) return normalized;
  return "free";
}

export default function AccessGate({ required, children }: Props) {
  const { user, loading } = useUser();

  if (loading) return null;

  const plan: PlanCode = user ? coercePlan(user.plan) : "free";

  if (!canAccess(plan, required)) {
    return (
      <div className="border p-8 mt-12 text-center">
        <h2 className="text-2xl font-bold">Upgrade Required</h2>
        <p className="mt-2">
          This feature requires the <strong>{required}</strong> plan.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
