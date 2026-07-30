import { createFileBackedCmsEngine } from "./global-content";
import type { AdminSession } from "@/lib/admin-content/types";

export type CmsActor = {
  userId: string;
  role: string;
};

const engine = createFileBackedCmsEngine();

export function getCmsEngine() {
  return engine;
}

/**
 * Derive a CMS actor from a validated admin session.
 * Owner sessions receive super_admin CMS privileges.
 * Admin sessions receive administrator CMS privileges.
 */
export function actorFromAdminSession(session: AdminSession): CmsActor {
  const role = session.role === "owner" ? "super_admin" : "administrator";
  return { userId: session.email, role };
}
