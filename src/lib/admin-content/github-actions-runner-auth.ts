import type { NextRequest } from "next/server";

import { DEFAULT_GITHUB_OIDC_AUDIENCE, type JwksFetcher, verifyGithubOidcToken } from "@/lib/admin-content/github-oidc";

/** Workflow files allowed to call machine-authorized admin endpoints. */
export const GITHUB_RUNNER_WORKFLOWS = {
  productionAudit: ".github/workflows/production-curriculum-audit.yml",
  githubExport: ".github/workflows/curriculum-github-export.yml",
  packageRecovery: ".github/workflows/one-time-package-recovery.yml",
  curriculumArchive: ".github/workflows/curriculum-archive.yml",
  kpiSpoolRecovery: ".github/workflows/kpi-spool-recovery.yml",
} as const;

/**
 * Authorize a GitHub Actions runner by its signed OIDC identity token
 * (Authorization: Bearer <OIDC JWT>). Fails closed when configuration is missing,
 * when GitHub's signing keys cannot be fetched, or when any claim does not match.
 * The previous GITHUB_TOKEN + run-ID check is intentionally no longer accepted.
 */
export async function authorizeGithubActionsRun(
  request: NextRequest | Request,
  allowedEvents: readonly string[],
  workflowPath: string,
  options: { env?: Record<string, string | undefined>; fetcher?: JwksFetcher; nowSeconds?: number } = {},
): Promise<boolean> {
  const env = options.env ?? process.env;
  const owner = env.EDUNANCIAL_GITHUB_OWNER?.trim();
  const repo = env.EDUNANCIAL_GITHUB_REPO?.trim();
  if (!owner || !repo || !workflowPath) return false;

  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return false;
  // Optional header: if a caller states a run ID, it must match the signed claim.
  const runIdHeader = request.headers.get("x-github-run-id")?.trim() || undefined;

  const claims = await verifyGithubOidcToken(token, {
    audience: env.EDUNANCIAL_GITHUB_OIDC_AUDIENCE?.trim() || DEFAULT_GITHUB_OIDC_AUDIENCE,
    repository: `${owner}/${repo}`,
    repositoryId: env.EDUNANCIAL_GITHUB_REPOSITORY_ID?.trim() || undefined,
    ref: "refs/heads/main",
    workflowPath,
    allowedEvents,
    runId: runIdHeader,
    nowSeconds: options.nowSeconds,
  }, options.fetcher);
  return claims !== null;
}
