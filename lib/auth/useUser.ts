// lib/auth/useUser.ts

"use client";

import { useMemo } from "react";
import type { PlanCode } from "@/types/plan";
import { normalizePlan } from "@/types/plan";
import { useSession } from "./useSession";
import type { UserSession } from "./session";

export function useUser(): {
  user: UserSession | null;
  plan: PlanCode;
  loading: boolean;
} {
  const { session, loading } = useSession();

  const plan = useMemo<PlanCode>(() => {
    const raw = session?.plan;
    if (typeof raw !== "string") return "free";
    return normalizePlan(raw);
  }, [session?.plan]);

  return { user: session, plan, loading };
}
