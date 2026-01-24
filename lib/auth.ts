// lib/auth.ts
// Minimal build-safe auth stub.
// This prevents Netlify/Next.js from failing on missing module imports.
// Replace with real authentication later.

export type AdminUser = {
  id: string;
  email: string;
  role: "admin";
};

export function requireAdmin(): AdminUser {
  // Build-safe placeholder (no runtime auth yet)
  return {
    id: "dev-admin",
    email: "admin@example.com",
    role: "admin",
  };
}

export function isAdminEmail(email: string): boolean {
  return email.toLowerCase().includes("admin");
}
