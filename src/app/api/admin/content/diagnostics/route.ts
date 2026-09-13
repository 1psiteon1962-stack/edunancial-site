import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";

export const maxDuration = 26;
const NETLIFY_BODY_LIMIT_BYTES = 6 * 1024 * 1024;
type ActiveUploadMode = "netlify-blobs" | "legacy-local" | "unavailable";

export type DiagnosticsResult = {
  supabaseUrlConfigured: boolean;
  anonKeyConfigured: boolean;
  serviceRoleConfigured: boolean;
  storageBucketConfigured: boolean;
  storageBucketName: string | null;
  bucketReachable: boolean;
  signedUploadAvailable: boolean;
  githubTokenConfigured: boolean;
  githubOwnerConfigured: boolean;
  githubRepoConfigured: boolean;
  githubOwner: string | null;
  githubRepo: string | null;
  githubRepositoryReachable: boolean;
  activeUploadMode: ActiveUploadMode;
  netlifySafeUploadLimitBytes: number;
  productionReady: boolean;
  problems: string[];
};

async function checkGithubRepoReachable(token: string, owner: string, repo: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { method: "GET", headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + token }, cache: "no-store", signal: AbortSignal.timeout(5000) });
    return response.status === 200;
  } catch { return false; }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;
  const githubToken = process.env.EDUNANCIAL_GITHUB_TOKEN?.trim() || null;
  const githubOwner = process.env.EDUNANCIAL_GITHUB_OWNER?.trim() || null;
  const githubRepo = process.env.EDUNANCIAL_GITHUB_REPO?.trim() || null;
  const isProduction = process.env.NODE_ENV === "production";
  let githubRepositoryReachable = false;
  if (githubToken && githubOwner && githubRepo) githubRepositoryReachable = await checkGithubRepoReachable(githubToken, githubOwner, githubRepo);
  const problems: string[] = [];
  if (!githubToken) problems.push("EDUNANCIAL_GITHUB_TOKEN is not set — GitHub PR publication unavailable.");
  if (!githubOwner) problems.push("EDUNANCIAL_GITHUB_OWNER is not set — set to '1psiteon1962-stack'.");
  if (!githubRepo) problems.push("EDUNANCIAL_GITHUB_REPO is not set — set to 'edunancial-site'.");
  if (githubToken && githubOwner && githubRepo && !githubRepositoryReachable) problems.push(`GitHub repository ${githubOwner}/${githubRepo} is not reachable — verify repository permissions.`);
  const activeUploadMode: ActiveUploadMode = isProduction ? "netlify-blobs" : "legacy-local";
  const productionReady = Boolean(githubToken && githubOwner && githubRepo && githubRepositoryReachable);
  return Response.json({
    supabaseUrlConfigured: false, anonKeyConfigured: false, serviceRoleConfigured: false,
    storageBucketConfigured: true, storageBucketName: isProduction ? "Netlify Blobs" : "local development", bucketReachable: true, signedUploadAvailable: false,
    githubTokenConfigured: Boolean(githubToken), githubOwnerConfigured: Boolean(githubOwner), githubRepoConfigured: Boolean(githubRepo),
    githubOwner, githubRepo, githubRepositoryReachable, activeUploadMode, netlifySafeUploadLimitBytes: NETLIFY_BODY_LIMIT_BYTES, productionReady, problems,
  } satisfies DiagnosticsResult);
}
