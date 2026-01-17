// lib/auth/useSession.ts

"use client";

import { useEffect, useState } from "react";
import { clearSession, getSession, setSession, type UserSession } from "./session";

export function useSession() {
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSessionState(getSession());
    setLoading(false);
  }, []);

  function update(next: UserSession | null) {
    setSession(next);
    setSessionState(next);
  }

  function clear() {
    clearSession();
    setSessionState(null);
  }

  return { session, loading, setSession: update, clearSession: clear };
}
