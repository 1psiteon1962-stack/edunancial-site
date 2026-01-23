// lib/auth.ts

/**
 * Temporary admin gate for build stability.
 * Later you will replace this with real authentication logic.
 */

export function requireAdmin(_ctx?: unknown) {
  // For now, do nothing (admin pages stay accessible during development).
  // Later you can enforce:
  // - session checks
  // - redirects
  // - role validation
  return;
}
