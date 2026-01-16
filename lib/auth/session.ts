"use client";

import { useCallback, useEffect, useState } from "react";
import { normalizePlan, type PlanCode } from "@/types/plan";

export type UserSession = {
  userId: string;
  email: string;
  plan: PlanCode;
};

const STORAGE_KEY = "edunancial.session";

/**
 * Read session once (non-hook use)
 */
export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return {
      userId: parsed.userId,
      email: parsed.email,
      plan: normalizePlan(parsed.plan),
    };
  } catch {
    return null;
  }
}

/**
 * React hook session access
 */
export function useSession() {
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    setSessionState(s);
    setLoading(false);
  }, []);

  const setSession = useCallback((next: UserSession | null) => {
    setSessionState(next);
    if (typeof window === "undefined") return;

    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const clearSession = useCallback(() => {
    setSession(null);
  }, [setSession]);

  return { session, loading, setSession, clearSession };
}
