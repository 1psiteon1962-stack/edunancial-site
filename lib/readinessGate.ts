import { READINESS, ReadinessKey } from "./readiness";

/**
 * Strategic readiness checks.
 */

export function isReady(key: ReadinessKey): boolean {
  return Boolean(READINESS[key]);
}
