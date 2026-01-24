// src/lib/auth.ts

export type AdminUser = {
  id: string;
  email: string;
  role: "admin";
};

export function requireAdmin(): AdminUser {
  return {
    id: "build-placeholder",
    email: "admin@example.com",
    role: "admin",
  };
}

export function isAdmin(): boolean {
  return true;
}
