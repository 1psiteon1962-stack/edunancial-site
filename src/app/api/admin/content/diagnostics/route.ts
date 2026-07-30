/**
 * GET /api/admin/content/diagnostics
 *
 * Admin-authenticated endpoint that reports the configuration health of the
 * content-upload pipeline without exposing any secret values.
 *
 * Inspects Supabase storage, GitHub integration, and upload-mode availability,
 * then returns a JSON summary that the /admin/content/upload page renders as a
 * READY / BLOCKED status panel.
 */
import { NextRequest } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";

export const maxDuration = 26;

// Netlify function body limit — uploads larger than this cannot use the legacy
// multipart path in production.
const NETLIFY_BODY_LIMIT_BYTES = 6 * 1024 * 1024;

type ActiveUploadMode = "signed-supabase" | "unavailable";

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

function normalizeUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  return raw.trim().replace(/\/+$/, "");
}

async function checkBucketReachable(
  supabaseUrl: string,
  bucket: string,
  serviceRoleKey: string | null,
  anonKey: string | null,
): Promise<boolean> {
  const key = serviceRoleKey ?? anonKey;
  if (!key) return false;
  try {
    const response = await fetch(`${supabaseUrl}/storage/v1/bucket/${encodeURIComponent(bucket)}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + key, apikey: key },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    // 200 = bucket exists; 404 = bucket does not exist but Supabase is reachable
    return response.status === 200 || response.status === 404;
  } catch {
    return false;
  }
}

async function checkBucketExists(
  supabaseUrl: string,
  bucket: string,
  serviceRoleKey: string | null,
  anonKey: string | null,
): Promise<boolean> {
  const key = serviceRoleKey ?? anonKey;
  if (!key) return false;
  try {
    const response = await fetch(`${supabaseUrl}/storage/v1/bucket/${encodeURIComponent(bucket)}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + key, apikey: key },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (response.status === 200) return true;
    // Some Supabase proxy versions return 400 with statusCode "404"
    if (response.status === 400) {
      try {
        const body = (await response.json()) as { statusCode?: string | number };
        return String(body?.statusCode) !== "404";
      } catch {
        return false;
      }
    }
    return false;
  } catch {
    return false;
  }
}

async function checkGithubRepoReachable(
  token: string,
  owner: string,
  repo: string,
): Promise<boolean> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: "Bearer " + token,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;

  const supabaseUrl = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;
  const bucketRaw =
    process.env.EDUNANCIAL_UPLOAD_STORAGE_BUCKET?.trim() ||
    process.env.EDUNANCIAL_UPLOAD_STORAGE_KEY?.trim() ||
    null;
  const githubToken = process.env.EDUNANCIAL_GITHUB_TOKEN?.trim() || null;
  const githubOwner = process.env.EDUNANCIAL_GITHUB_OWNER?.trim() || null;
  const githubRepo = process.env.EDUNANCIAL_GITHUB_REPO?.trim() || null;
  const supabaseUrlConfigured = Boolean(supabaseUrl);
  const anonKeyConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
  const serviceRoleConfigured = Boolean(serviceRoleKey);
  const storageBucketConfigured = Boolean(bucketRaw);
  const githubTokenConfigured = Boolean(githubToken);
  const githubOwnerConfigured = Boolean(githubOwner);
  const githubRepoConfigured = Boolean(githubRepo);

  // Safe bucket name: we reveal the configured bucket name (not a secret)
  // to help the admin verify they set the correct value.
  const storageBucketName = bucketRaw ?? null;

  let bucketReachable = false;
  let signedUploadAvailable = false;
  let githubRepositoryReachable = false;

  // Probe Supabase storage when URL and at least one key are present.
  if (supabaseUrl && bucketRaw && serviceRoleKey) {
    bucketReachable = await checkBucketReachable(supabaseUrl, bucketRaw, serviceRoleKey, null);
    if (bucketReachable) {
      const exists = await checkBucketExists(supabaseUrl, bucketRaw, serviceRoleKey, null);
      signedUploadAvailable = serviceRoleConfigured && exists;
    }
  }

  // Probe GitHub when all three values are present.
  if (githubToken && githubOwner && githubRepo) {
    githubRepositoryReachable = await checkGithubRepoReachable(githubToken, githubOwner, githubRepo);
  }

  // Determine upload mode.
  let activeUploadMode: ActiveUploadMode;
  if (signedUploadAvailable) {
    activeUploadMode = "signed-supabase";
  } else {
    activeUploadMode = "unavailable";
  }

  // Collect actionable problems.
  const problems: string[] = [];

  if (!supabaseUrlConfigured) {
    problems.push("NEXT_PUBLIC_SUPABASE_URL is not set — Supabase storage unavailable.");
  }
  if (!serviceRoleConfigured) {
    problems.push(
      "SUPABASE_SERVICE_ROLE_KEY is not set — the production signed-upload pipeline is unavailable.",
    );
  }
  if (!storageBucketConfigured) {
    problems.push(
      "EDUNANCIAL_UPLOAD_STORAGE_BUCKET is not set — use 'admin-content' as the recommended bucket name.",
    );
  }
  if (supabaseUrl && bucketRaw && serviceRoleKey && !bucketReachable) {
    problems.push(
      `Supabase storage bucket "${bucketRaw}" is not reachable — check network connectivity and RLS policies.`,
    );
  }
  if (supabaseUrl && bucketRaw && serviceRoleKey && bucketReachable && !signedUploadAvailable) {
    problems.push(`Bucket "${bucketRaw}" exists but signed upload URL creation is still unavailable.`);
  }
  if (!githubTokenConfigured) {
    problems.push("EDUNANCIAL_GITHUB_TOKEN is not set — GitHub PR publication unavailable.");
  }
  if (!githubOwnerConfigured) {
    problems.push("EDUNANCIAL_GITHUB_OWNER is not set — set to '1psiteon1962-stack'.");
  }
  if (!githubRepoConfigured) {
    problems.push("EDUNANCIAL_GITHUB_REPO is not set — set to 'edunancial-site'.");
  }
  if (githubToken && githubOwner && githubRepo && !githubRepositoryReachable) {
    problems.push(
      `GitHub repository ${githubOwner}/${githubRepo} is not reachable — verify EDUNANCIAL_GITHUB_TOKEN has 'contents:write' and 'pull-requests:write' permissions.`,
    );
  }
  if (activeUploadMode === "unavailable") {
    problems.push(
      "Production upload is unavailable — configure NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and EDUNANCIAL_UPLOAD_STORAGE_BUCKET.",
    );
  }

  const productionReady =
    activeUploadMode === "signed-supabase" &&
    githubTokenConfigured &&
    githubOwnerConfigured &&
    githubRepoConfigured &&
    githubRepositoryReachable;

  const result: DiagnosticsResult = {
    supabaseUrlConfigured,
    anonKeyConfigured,
    serviceRoleConfigured,
    storageBucketConfigured,
    storageBucketName,
    bucketReachable,
    signedUploadAvailable,
    githubTokenConfigured,
    githubOwnerConfigured,
    githubRepoConfigured,
    githubOwner: githubOwner ?? null,
    githubRepo: githubRepo ?? null,
    githubRepositoryReachable,
    activeUploadMode,
    netlifySafeUploadLimitBytes: NETLIFY_BODY_LIMIT_BYTES,
    productionReady,
    problems,
  };

  return Response.json(result);
}
