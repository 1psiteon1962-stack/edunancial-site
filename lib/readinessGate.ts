/**
 * Feature readiness registry.
 * This can later be driven by env vars, flags, or remote config.
 */

const READY_KEYS = new Set<string>([
  "us-live",
  "latam-live",
  "caribbean-live",
  "africa-live",
  "europe-live",
  "asia-live",
  // intentionally NOT including "cuba-locked"
]);

export function isReady(key: string): boolean {
  return READY_KEYS.has(key);
}
