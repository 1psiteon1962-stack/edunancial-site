"use client";

import { getSession } from "./session";
import { normalizePlan, type PlanCode } from "@/types/plan";

export function useUser() {
  const session = getSession();

  if (!session) {
    return {
      user: null,
      plan: "free" as PlanCode,
    };
  }

  return {
    user: session,
    plan: normalizePlan(session.plan),
  };
}
