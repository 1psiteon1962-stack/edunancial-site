"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type SessionUser = {
  id: string;
  email: string;
  role: string;
};

type SessionState =
  | { status: "loading"; user: null }
  | { status: "authenticated"; user: SessionUser }
  | { status: "unauthenticated"; user: null };

type SessionContextValue = SessionState & {
  refresh: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue>({
  status: "loading",
  user: null,
  refresh: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>({
    status: "loading",
    user: null,
  });

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as { user: SessionUser | null };
        if (data.user) {
          setState({ status: "authenticated", user: data.user });
        } else {
          setState({ status: "unauthenticated", user: null });
        }
      } else {
        setState({ status: "unauthenticated", user: null });
      }
    } catch {
      setState({ status: "unauthenticated", user: null });
    }
  }, []);

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  return (
    <SessionContext.Provider value={{ ...state, refresh: fetchSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  return useContext(SessionContext);
}

/** Read the CSRF token stored in the `edunancial_csrf` cookie. */
export function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith("edunancial_csrf="));
  return match ? decodeURIComponent(match.split("=")[1] ?? "") : "";
}
