'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type UserRole = 'student' | 'admin';

type User = {
  id: string;
  email: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  loginAsStudent: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('authUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const persist = (user: User | null) => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }
    setUser(user);
  };

  const loginAsStudent = () =>
    persist({
      id: 'student-1',
      email: 'student@edunancial.com',
      role: 'student',
    });

  const loginAsAdmin = () =>
    persist({
      id: 'admin-1',
      email: 'admin@edunancial.com',
      role: 'admin',
    });

  const logout = () => persist(null);

  return (
    <AuthContext.Provider
      value={{ user, loginAsStudent, loginAsAdmin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
