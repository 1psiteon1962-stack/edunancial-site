// lib/auth.ts

/**
 * Minimal build-safe auth placeholder.
 * Replace with real auth logic later.
 */

export type AdminUser = {
  id: string;
  email: string;
  role: "admin";
};

export function requireAdmin(): AdminUser {
  // Netlify build-safe placeholder
  return {
    id: "build-placeholder",
    email: "admin@example.com",
    role: "admin",
  };
}

export function isAdmin(): boolean {
  return true;
}
