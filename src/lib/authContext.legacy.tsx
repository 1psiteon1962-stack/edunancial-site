"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  BETA_AUDIT_STORAGE_KEY,
  BETA_INVITATIONS_STORAGE_KEY,
  type BetaAccessSummary,
  type BetaAuditEntry,
  type BetaInvitationRecord,
  applyBetaLogin,
  getBetaAccessSummary,
  normalizeEmail,
} from "@/lib/beta-access";
import { PASSWORD_POLICY } from "@/lib/passwordPolicy";

const STORAGE_KEY = "edu_auth";
const USERS_KEY = "edu_users";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  membershipTier: "free" | "basic" | "premium" | "enterprise" | "beta";
  joinedDate: string;
  country: string;
  phone?: string;
  bio?: string;
  assessmentCompleted: boolean;
  overallScore: number | null;
  betaAccess?: BetaAccessSummary | null;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
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
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
  passwordErrors: (password: string) => string[];
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
}

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h.toString(16);
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getBetaInvitations(): BetaInvitationRecord[] {
  try {
    const raw = localStorage.getItem(BETA_INVITATIONS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BetaInvitationRecord[]) : [];
  } catch {
    return [];
  }
}

function saveBetaInvitations(invitations: BetaInvitationRecord[]): void {
  localStorage.setItem(BETA_INVITATIONS_STORAGE_KEY, JSON.stringify(invitations));
}

function appendBetaAuditEntries(entries: BetaAuditEntry[]): void {
  if (entries.length === 0) {
    return;
  }

  try {
    const raw = localStorage.getItem(BETA_AUDIT_STORAGE_KEY);
    const existing = raw ? (JSON.parse(raw) as BetaAuditEntry[]) : [];
    localStorage.setItem(BETA_AUDIT_STORAGE_KEY, JSON.stringify([...existing, ...entries]));
  } catch {
    localStorage.setItem(BETA_AUDIT_STORAGE_KEY, JSON.stringify(entries));
  }
}

function syncStoredUser(user: AuthUser): void {
  const users = getUsers();
  const index = users.findIndex((storedUser) => storedUser.id === user.id);
  if (index >= 0) {
    users[index] = { ...users[index], ...user };
    saveUsers(users);
  }
}

function applyPersistedBetaState(user: AuthUser): AuthUser {
  const invitation = getBetaInvitations().find(
    (candidate) => normalizeEmail(candidate.approvedEmail) === normalizeEmail(user.email),
  );
  const access = getBetaAccessSummary(invitation ?? null, user.email);

  if (access.status === "active") {
    return {
      ...user,
      membershipTier: "beta",
      betaAccess: access,
    };
  }

  if (access.status === "expired" || access.status === "revoked") {
    return {
      ...user,
      membershipTier: user.membershipTier === "beta" ? "free" : user.membershipTier,
      betaAccess: access,
    };
  }

  return {
    ...user,
    betaAccess: access.status === "none" ? null : access,
  };
}

export function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < PASSWORD_POLICY.minimumLength)
    errors.push(`At least ${PASSWORD_POLICY.minimumLength} characters`);
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

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsedUser = JSON.parse(raw) as AuthUser;
        const syncedUser = applyPersistedBetaState(parsedUser);
        setUser(syncedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(syncedUser));
        syncStoredUser(syncedUser);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
      betaPassNumber?: string,
    ): Promise<{ success: boolean; error?: string }> => {
      await new Promise((r) => setTimeout(r, 500));
      const users = getUsers();
      const found = users.find(
        (candidate) => candidate.email.toLowerCase() === email.toLowerCase(),
      );
      if (!found) {
        return { success: false, error: "No account found with that email address." };
      }
      if (found.passwordHash !== simpleHash(password)) {
        return { success: false, error: "Incorrect password. Please try again." };
      }

      const { passwordHash: _, ...storedAuthUser } = found;
      const invitations = getBetaInvitations();
      const invitationIndex = invitations.findIndex(
        (candidate) => normalizeEmail(candidate.approvedEmail) === normalizeEmail(email),
      );
      const betaResult = await applyBetaLogin({
        invitation: invitationIndex >= 0 ? invitations[invitationIndex] : null,
        email,
        passNumber: betaPassNumber,
      });

      if (betaResult.error) {
        appendBetaAuditEntries(betaResult.auditEntries);
        return { success: false, error: betaResult.error };
      }

      if (invitationIndex >= 0 && betaResult.invitation) {
        invitations[invitationIndex] = betaResult.invitation;
        saveBetaInvitations(invitations);
      }

      appendBetaAuditEntries(betaResult.auditEntries);

      const authUser =
        betaResult.access.status === "active"
          ? {
              ...storedAuthUser,
              membershipTier: "beta" as const,
              betaAccess: betaResult.access,
            }
          : applyPersistedBetaState(storedAuthUser);

      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      syncStoredUser(authUser);
      return { success: true };
    },
    [],
  );

  const register = useCallback(
    async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
      await new Promise((r) => setTimeout(r, 600));
      const errors = validatePassword(data.password);
      if (errors.length > 0)
        return { success: false, error: errors.join(". ") };
      const users = getUsers();
      if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase()))
        return { success: false, error: "An account with this email already exists." };
      const newUser: StoredUser = {
        id: generateId(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        membershipTier: "free",
        joinedDate: new Date().toISOString(),
        assessmentCompleted: false,
        overallScore: null,
        betaAccess: null,
        passwordHash: simpleHash(data.password),
      };
      saveUsers([...users, newUser]);
      const { passwordHash: _, ...authUser } = newUser;
      const syncedUser = applyPersistedBetaState(authUser);
      setUser(syncedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(syncedUser));
      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateProfile = useCallback((data: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      syncStoredUser(updated);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile, passwordErrors: validatePassword }}
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
