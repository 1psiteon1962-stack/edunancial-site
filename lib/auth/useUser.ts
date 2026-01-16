"use client";

import { useEffect, useState } from "react";
import { UserSession, getSession } from "./session";

export function useUser() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    setUser(session);
    setLoading(false);
  }, []);

  return { user, loading };
}
