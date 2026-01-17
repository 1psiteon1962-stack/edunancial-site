"use client";

import { useMemo } from "react";
import { useSession } from "./useSession";
import { normalizePlan, type PlanCode } from "@/types/plan";

export function useUser(): {
  user: any;
  plan: PlanCode;
  loading: boolean;
} {
  const { session, loading } = useSession();

  const plan = useMemo<PlanCode>(() => {
    if (!session?.plan || typeof session.plan !== "string") return "free";
    return normalizePlan(session.plan);
  }, [session?.plan]);

  return {
    user: session,
    plan,
    loading,
  };
}
