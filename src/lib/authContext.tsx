"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { validatePassword } from "@/lib/auth/password";
import type {
  AuthResult,
  AuthUser,
  PasswordUpdateResult,
  RegisterData,
  SessionPayload,
} from "@/lib/auth/types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  csrfToken: string | null;
  login: (
    email: string,
    password: string,
    betaPassNumber?: string,
  ) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<AuthResult>;
  refreshSession: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<PasswordUpdateResult>;
  signOutOtherSessions: () => Promise<AuthResult>;
  passwordErrors: (password: string) => string[];
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchSession(): Promise<SessionPayload> {
  const response = await fetch("/api/member/session", { cache: "no-store" });
  if (!response.ok) {
    return { authenticated: false, user: null, csrfToken: null };
  }
  return (await response.json()) as SessionPayload;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const session = await fetchSession();
    setUser(session.user);
    setCsrfToken(session.csrfToken);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    void refreshSession().finally(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event) => {
      void refreshSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshSession]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }

    await refreshSession();
    await fetch("/api/auth/sync-membership", { method: "POST" }).catch(() => undefined);
    return { success: true };
  }, [refreshSession]);

  const register = useCallback(async (data: RegisterData): Promise<AuthResult> => {
    const errors = validatePassword(data.password);
    if (errors.length > 0) {
      return { success: false, error: errors.join(". ") };
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${origin}/auth/confirm?next=/verify-email?verified=1`,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          country: data.country,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    await refreshSession();
    return { success: true };
  }, [refreshSession]);

  const logout = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    await fetch("/api/member/session", {
      method: "DELETE",
      headers: csrfToken ? { "x-csrf-token": csrfToken } : undefined,
    }).catch(() => undefined);
    await supabase.auth.signOut();
    setUser(null);
  }, [csrfToken]);

  const updateProfile = useCallback(async (data: Partial<AuthUser>): Promise<AuthResult> => {
    const response = await fetch("/api/member/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
      },
      body: JSON.stringify(data),
    });

    const payload = (await response.json().catch(() => ({}))) as { user?: AuthUser; error?: string };
    if (!response.ok || !payload.user) {
      return { success: false, error: payload.error ?? "Unable to update profile." };
    }

    setUser(payload.user);
    return { success: true };
  }, [csrfToken]);

  const requestPasswordReset = useCallback(async (email: string): Promise<AuthResult> => {
    const response = await fetch("/api/member/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    return response.ok
      ? { success: true }
      : { success: false, error: payload.error ?? "Unable to request password reset." };
  }, []);

  const updatePassword = useCallback(async (newPassword: string): Promise<PasswordUpdateResult> => {
    const errors = validatePassword(newPassword);
    if (errors.length > 0) {
      return { success: false, error: errors.join(". ") };
    }

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return { success: false, error: error.message };
    }

    await refreshSession();
    return { success: true };
  }, [refreshSession]);

  const signOutOtherSessions = useCallback(async (): Promise<AuthResult> => {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut({ scope: "others" });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    csrfToken,
    login,
    register,
    logout,
    updateProfile,
    refreshSession,
    requestPasswordReset,
    updatePassword,
    signOutOtherSessions,
    passwordErrors: validatePassword,
  }), [user, loading, csrfToken, login, register, logout, updateProfile, refreshSession, requestPasswordReset, updatePassword, signOutOtherSessions]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { validatePassword };
export type { AuthUser, RegisterData } from "@/lib/auth/types";
