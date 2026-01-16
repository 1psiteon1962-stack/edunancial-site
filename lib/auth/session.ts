"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Canonical user session shape
 */
export type UserSession = {
  userId: string;
  email: string;
  plan: string;
};

const STORAGE_KEY = "edunancial.session";

/**
 * Safe JSON parse
 */
function parseSession(value: string | null): UserSession | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (!parsed?.userId || !parsed?.email) return null;
    return parsed as UserSession;
  } catch {
    return null;
  }
}

/**
 * PRIMARY SESSION HOOK
 * This is the ONLY source of truth.
 */
export function useSession() {
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    setSessionState(parseSession(stored));
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

  return {
    session,
    loading,
    setSession,
    clearSession,
  };
}
