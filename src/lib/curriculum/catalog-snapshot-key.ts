/**
 * Owner decision (2026-11-17): preview deploys must never write into the
 * production catalog snapshots. Production keeps its existing key; every
 * other deploy context gets its own namespace per deploy.
 */
export function catalogSnapshotKey(
  language: string,
  env: Partial<Record<"CONTEXT" | "DEPLOY_ID", string | undefined>> = {
    CONTEXT: process.env.CONTEXT,
    DEPLOY_ID: process.env.DEPLOY_ID,
  },
): string {
  const file = `catalog-snapshots/v1/${encodeURIComponent(language)}.json`;
  if (env.CONTEXT === "production") return `published/${file}`;
  const deploy = (env.DEPLOY_ID || "unknown").replace(/[^A-Za-z0-9_-]/g, "") || "unknown";
  return `preview/${deploy}/${file}`;
}
