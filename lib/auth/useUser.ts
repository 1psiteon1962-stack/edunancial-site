"use client";

import { useEffect, useState } from "react";
import { getSession, type UserSession } from "./session";

export function useUser() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    setUser(s);
    setLoading(false);
  }, []);

  return { user, loading };
}
