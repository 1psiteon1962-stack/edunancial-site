/**
 * Where the owner lands after the secure email-link sign-in.
 * Only same-site admin or executive paths are allowed, so a crafted
 * link can never send the owner to another website.
 */
export const OWNER_NEXT_STORAGE_KEY = "edunancial-owner-next";
export const DEFAULT_OWNER_NEXT = "/admin/video-studio";

export function safeOwnerNext(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const path = value.trim();
  if (path.length === 0 || path.length > 200) return null;
  if (!/^\/(admin|executive)(\/|$)/u.test(path)) return null;
  if (path.includes("//") || path.includes("\\") || /[\s<>"']/u.test(path)) return null;
  return path;
}
