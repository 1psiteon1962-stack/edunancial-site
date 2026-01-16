"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserSession } from "@/types/session";
import { DEFAULT_PLAN } from "@/types/plan";

const STORAGE_KEY = "edunancial.session";

type SessionState = {
  session: UserSession | null;
  loading: boolean;
  setSession: (next: UserSession | null) => void;
  clearSession: () => void;
};

function safeParse(json: string | null): UserSession | null {
  if (!json) return null;
  try {
    const obj = JSON.parse(json) as Partial<UserSession> | null;
    if (!obj || typeof obj !== "object") return null;

    const userId = typeof obj.userId === "string" ? obj.userId : "";
    const email = typeof obj.email === "string" ? obj.email : "";
    const plan = typeof obj.plan === "string" ? obj.plan : DEFAULT_PLAN;

    if (!userId || !email) return null;

    return { userId, email, plan: plan as any };
  } catch {
    return null;
  }
}

export function useSession(): SessionState {
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = safeParse(
      typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY)
    );
    setSessionState(existing);
    setLoading(false);
  }, []);

  const setSession = useCallback((next: UserSession | null) => {
    setSessionState(next);
    if (typeof window === "undefined") return;

    if (!next) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const clearSession = useCallback(() => setSession(null), [setSession]);

  return { session, loading, setSession, clearSession };
}
```0
