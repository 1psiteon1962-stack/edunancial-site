"use client";

import { useEffect, useState } from "react";

/**
 * Detects whether the current browser has an active admin session.
 *
 * The admin CSRF cookie (edunancial_admin_csrf) is set as httpOnly=false so it
 * can be read from JavaScript to signal that an admin session is active.
 * The actual session token remains httpOnly and is never exposed to JS.
 */
export function useAdminSession(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const cookiePresent = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("edunancial_admin_csrf="));
    setIsAdmin(cookiePresent);
  }, []);

  return isAdmin;
}
