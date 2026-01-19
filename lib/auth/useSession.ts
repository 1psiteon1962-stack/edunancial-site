"use client";

import { useState } from "react";
import type { UserSession } from "./session";

export function useSession(): {
  session: UserSession | null;
  loading: boolean;
  setSession: (s: UserSession | null) => void;
} {
  const [session, setSession] = useState<UserSession | null>(null);

  return {
    session,
    loading: false,
    setSession,
  };
}
