/**
 * Client-side session hook.
 *
 * Returns the current auth user from the AuthContext.
 * Used by components that need to check authentication state.
 */

"use client";

import { useAuth } from "@/lib/authContext";

export function useSession() {
  const { user, loading } = useAuth();
  return { user, loading, isLoggedIn: !!user };
}
