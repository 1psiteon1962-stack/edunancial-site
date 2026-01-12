"use client";

import { useEffect, useState } from "react";
import { UserSession, getSession } from "./session";

export function useUser() {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    setUser(getSession());
  }, []);

  return user;
}
