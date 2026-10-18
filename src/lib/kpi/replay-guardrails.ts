/** Operational policy for Q1 KPI spool recovery.
 * Replay must remain disabled until the Neon replay_key migration is applied,
 * and a protected caller explicitly enables recovery.
 */
export function requireKpiReplayAuthorization(env: Record<string, string | undefined>): void {
  if (env.KPI_SPOOL_REPLAY_ENABLED !== "true") {
    throw new Error("KPI spool replay is disabled");
  }
  if (env.KPI_REPLAY_MIGRATION_APPLIED !== "true") {
    throw new Error("KPI replay migration has not been confirmed");
  }
}

export function normalizeReplayBatchSize(value: string | undefined): number {
  const parsed = Number(value ?? "25");
  if (!Number.isSafeInteger(parsed) || parsed < 1) return 25;
  return Math.min(parsed, 100);
}
