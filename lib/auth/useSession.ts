"use client";

import { useEffect, useState } from "react";
import { getSession, setSession as persistSession, clearSession } from "./session";

export type UserSession = {
  id?: string;
  email?: string;
  plan?: string;
};

export function useSession() {
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = getSession();
    setSessionState(existing);
    setLoading(false);
  }, []);

  function setSession(next: UserSession | null) {
    persistSession(next);
    setSessionState(next);
  }

  function clear() {
    clearSession();
    setSessionState(null);
  }

  return {
    session,
    loading,
    setSession,
    clearSession: clear,
  };
}
