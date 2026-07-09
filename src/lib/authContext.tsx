"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { PASSWORD_POLICY } from "@/lib/passwordPolicy";

const STORAGE_KEY = "edu_auth";
const USERS_KEY = "edu_users";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  membershipTier: "free" | "basic" | "premium" | "enterprise";
  joinedDate: string;
  country: string;
  phone?: string;
  bio?: string;
  assessmentCompleted: boolean;
  overallScore: number | null;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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
        setUser(JSON.parse(raw) as AuthUser);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      await new Promise((r) => setTimeout(r, 500));
      const users = getUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (!found) return { success: false, error: "No account found with that email address." };
      if (found.passwordHash !== simpleHash(password))
        return { success: false, error: "Incorrect password. Please try again." };
      const { passwordHash: _, ...authUser } = found;
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      return { success: true };
    },
    []
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
        passwordHash: simpleHash(data.password),
      };
      saveUsers([...users, newUser]);
      const { passwordHash: _, ...authUser } = newUser;
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      return { success: true };
    },
    []
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
      // also update in users store
      const users = getUsers();
      const idx = users.findIndex((u) => u.id === prev.id);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...data };
        saveUsers(users);
      }
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
