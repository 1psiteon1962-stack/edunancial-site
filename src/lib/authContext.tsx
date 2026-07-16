/**
 * Client-side AuthProvider — production version.
 *
 * Obtains its state exclusively from the server session endpoint
 * (GET /api/auth/session). It does NOT:
 *  - store passwords
 *  - create users locally
 *  - determine membership authorization
 *  - use localStorage as the member database
 *
 * All auth decisions are made server-side. This context is a
 * thin UI-state layer that reflects the server's view of the session.
 *
 * The simpleHash function below is retained only for the legacy migration
 * helper; it is never used for production credential verification.
 */

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { type BetaAccessSummary } from "@/lib/beta-access";
import { PASSWORD_POLICY } from "@/lib/passwordPolicy";

// ============================================================
// TYPES
// ============================================================

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  membershipTier: "free" | "basic" | "premium" | "enterprise" | "beta";
  membershipStatus?: "active" | "inactive" | "trial" | "cancelled" | "grace_period" | "expired";
  joinedDate: string;
  country: string;
  phone?: string | null;
  biography?: string | null;
  preferredLanguage?: string;
  preferredCurrency?: string;
  assessmentCompleted: boolean;
  overallScore: number | null;
  betaAccess?: BetaAccessSummary | null;
  emailVerified?: boolean;
  accountStatus?: string;
  role?: "member" | "staff" | "administrator";
  lastLoginAt?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    betaPassNumber?: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => void;
  refreshSession: () => Promise<void>;
  passwordErrors: (password: string) => string[];
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
}

// ============================================================
// PASSWORD VALIDATION (client-side mirror of server policy)
// ============================================================

export function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < PASSWORD_POLICY.minimumLength)
    errors.push("At least " + PASSWORD_POLICY.minimumLength + " characters");
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password))
    errors.push("At least one uppercase letter");
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password))
    errors.push("At least one lowercase letter");
  if (PASSWORD_POLICY.requireNumber && !/[0-9]/.test(password))
    errors.push("At least one number");
  if (PASSWORD_POLICY.requireSpecialCharacter && !/[^A-Za-z0-9]/.test(password))
    errors.push("At least one special character (!@#$%^&*)");
  return errors;
}

// ============================================================
// SERVER API HELPERS
// ============================================================

async function fetchSession(): Promise<AuthUser | null> {
  try {
    const resp = await fetch("/api/auth/session", { credentials: "include" });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.authenticated || !data.user) return null;
    return serverUserToAuthUser(data.user);
  } catch {
    return null;
  }
}

function serverUserToAuthUser(u: Record<string, unknown>): AuthUser {
  return {
    id: u.id as string,
    email: u.email as string,
    firstName: u.firstName as string,
    lastName: u.lastName as string,
    membershipTier: (u.membershipTier as AuthUser["membershipTier"]) ?? "free",
    membershipStatus: u.membershipStatus as AuthUser["membershipStatus"],
    joinedDate: (u.joinedDate as string) ?? new Date().toISOString(),
    country: (u.country as string) ?? "",
    phone: u.phone as string | null,
    biography: u.biography as string | null,
    preferredLanguage: (u.preferredLanguage as string) ?? "en",
    preferredCurrency: (u.preferredCurrency as string) ?? "USD",
    assessmentCompleted: (u.assessmentCompleted as boolean) ?? false,
    overallScore: (u.overallScore as number | null) ?? null,
    betaAccess: (u.betaAccess as BetaAccessSummary | null) ?? null,
    emailVerified: (u.emailVerified as boolean) ?? false,
    accountStatus: (u.accountStatus as string) ?? "pending_verification",
    role: (u.role as AuthUser["role"]) ?? "member",
    lastLoginAt: (u.lastLoginAt as string | null) ?? null,
  };
}

// ============================================================
// AUTH CONTEXT
// ============================================================

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from server
  useEffect(() => {
    fetchSession()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const refreshSession = useCallback(async () => {
    const u = await fetchSession();
    setUser(u);
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
      _betaPassNumber?: string,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const resp = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        const data = await resp.json();

        if (data.success && data.user) {
          setUser(serverUserToAuthUser(data.user));
          return { success: true };
        }

        return { success: false, error: data.error ?? "Login failed." };
      } catch {
        return { success: false, error: "Network error. Please try again." };
      }
    },
    [],
  );

  const register = useCallback(
    async (registerData: RegisterData): Promise<{ success: boolean; error?: string }> => {
      try {
        const resp = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(registerData),
        });
        const data = await resp.json();

        if (data.success && data.user) {
          setUser(serverUserToAuthUser(data.user));
          return { success: true };
        }

        return { success: false, error: data.error ?? "Registration failed." };
      } catch {
        return { success: false, error: "Network error. Please try again." };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback((data: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...data };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshSession,
        passwordErrors: validatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
