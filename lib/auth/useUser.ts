// lib/auth/useUser.ts

import { useMemo } from "react";
import type { PlanCode, UserSession } from "./types";

/**
 * Temporary placeholder session loader.
 * Replace later with real auth provider.
 */
function getSession(): UserSession | null {
  return {
    userId: null,
    email: null,
    isAdmin: false,

    // ✅ Default plan so builds never fail
    plan: "starter",
  };
}

function normalizePlan(value: any): PlanCode {
  const allowed: PlanCode[] = [
    "starter",
    "builder",
    "pro",
    "elite",
    "founder",
  ];

  if (allowed.includes(value)) return value;
  return "starter";
}

export function useUser() {
  const session = getSession();

  const plan = useMemo<PlanCode>(() => {
    if (!session?.plan) return "starter";
    return normalizePlan(session.plan);
  }, [session?.plan]);

  return {
    session,
    plan,
    isAdmin: session?.isAdmin ?? false,
  };
}
