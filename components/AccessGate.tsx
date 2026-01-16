"use client";

import React from "react";
import { useUser } from "@/lib/auth/useUser";
import { canAccess } from "@/lib/access/canAccess";
import { normalizePlan } from "@/lib/auth/session";
import type { PlanCode } from "@/types/plan";

type Props = {
  required: PlanCode;
  children: React.ReactNode;
};

export default function AccessGate({ required, children }: Props) {
  const { user, loading } = useUser();

  if (loading) return null;

  const plan: PlanCode = user ? normalizePlan(user.plan) : "free";

  if (!canAccess(plan, required)) {
    return (
      <div className="border p-8 mt-12 text-center">
        <h2 className="text-2xl font-bold">Upgrade Required</h2>
        <p className="mt-2 opacity-80">
          This content requires <b>{required}</b>. Your plan is <b>{plan}</b>.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
