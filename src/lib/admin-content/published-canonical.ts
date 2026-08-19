import { getAdminContentStorage } from "@/lib/admin-content/storage";

const PUBLISHED_STATE_PATH = "published/curriculum-state.json";
const CANONICAL_LESSON_ID_RE = /^[A-Z][A-Z0-9]*-L[1-9][0-9]*-[0-9]{3,}$/u;

type PublishedStateShape = {
  lessons?: Record<string, { id?: string; status?: string } | null>;
};

/**
 * Parse authoritative published-state JSON into canonical active lesson IDs.
 * This pure helper keeps the safety rule testable without requiring Supabase.
 */
export function extractAuthoritativePublishedLessonIds(raw: string): Set<string> {
  let parsed: PublishedStateShape;
  try {
    parsed = JSON.parse(raw) as PublishedStateShape;
  } catch {
    return new Set();
  }

  const ids = new Set<string>();
  for (const [key, record] of Object.entries(parsed.lessons ?? {})) {
    const id = String(record?.id ?? key).trim().toUpperCase();
    const status = String(record?.status ?? "active").trim().toLowerCase();
    if (status !== "active" || !CANONICAL_LESSON_ID_RE.test(id)) continue;
    ids.add(id);
  }
  return ids;
}

/**
 * Return canonical lesson identities that are already authoritative in the
 * production published-state store. The public curriculum renders from this
 * same state, so translation publication must recognize these lessons even
 * when a historical repository registry has fallen behind.
 *
 * This never creates lesson identities. It only reads already-published active
 * lessons and therefore preserves the orphan-translation safety boundary.
 */
export async function getAuthoritativePublishedLessonIds(): Promise<Set<string>> {
  const storage = getAdminContentStorage();
  const buffer = await storage.readBinary(PUBLISHED_STATE_PATH);
  if (!buffer) return new Set();
  return extractAuthoritativePublishedLessonIds(buffer.toString("utf8"));
}
