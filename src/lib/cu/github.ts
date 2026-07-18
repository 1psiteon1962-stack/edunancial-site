import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { verifyAdminPassword } from "@/lib/admin-content/auth";
import { mergeCuContent, type CuDraftInput } from "@/lib/cu/workbench";

const DEFAULT_BRANCH = "main";

type GithubStatusState = "pending" | "success" | "failure";

type GithubFileResponse = {
  sha?: string;
  content?: string;
  encoding?: string;
};

type GithubContentUpdateResponse = {
  commit?: {
    sha?: string;
    html_url?: string;
  };
};

type GithubCommitStatuses = {
  state?: string;
  statuses?: Array<{
    context?: string;
    state?: string;
    target_url?: string;
  }>;
};

type GithubCheckRuns = {
  check_runs?: Array<{
    name?: string;
    status?: string;
    conclusion?: string | null;
    details_url?: string;
  }>;
};

function getGithubConfig() {
  const token = process.env.EDUNANCIAL_GITHUB_TOKEN?.trim();
  const owner = process.env.EDUNANCIAL_GITHUB_OWNER?.trim();
  const repo = process.env.EDUNANCIAL_GITHUB_REPO?.trim();
  const branch = process.env.EDUNANCIAL_GITHUB_BASE_BRANCH?.trim() || DEFAULT_BRANCH;

  if (!token || !owner || !repo) {
    throw new Error("GitHub publishing is not configured for CU.");
  }

  return { token, owner, repo, branch };
}

function getConfiguredCuPasswordHashes() {
  return [
    process.env.EDUNANCIAL_CU_PASSWORD_HASH,
    process.env.EDUNANCIAL_OWNER_PASSWORD_HASH,
    process.env.EDUNANCIAL_ADMIN_PASSWORD_HASH,
  ].filter((value): value is string => Boolean(value && value.startsWith("scrypt$")));
}

export function assertCuPassword(password: string) {
  const configuredHashes = getConfiguredCuPasswordHashes();
  if (configuredHashes.length === 0) {
    throw new Error("CU password is not configured.");
  }

  if (!configuredHashes.some((hash) => verifyAdminPassword(password, hash))) {
    throw new Error("Invalid CU password.");
  }
}

function toGithubContentsPath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

async function githubRequest<T>(path: string, init: RequestInit = {}, allowNotFound = false) {
  const { token, owner, repo } = getGithubConfig();
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (allowNotFound && response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`GitHub API request failed (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

async function getLocalFileContent(path: string) {
  try {
    return await readFile(join(process.cwd(), path), "utf8");
  } catch {
    return "";
  }
}

export async function getRepositoryFileContent(path: string) {
  try {
    const { branch } = getGithubConfig();
    const response = await githubRequest<GithubFileResponse>(`/contents/${toGithubContentsPath(path)}?ref=${encodeURIComponent(branch)}`, {}, true);
    if (!response) {
      return { content: "", sha: null };
    }
    const encodedContent = (response.content || "").replace(/\n/g, "");
    const content = response.encoding === "base64"
      ? Buffer.from(encodedContent, "base64").toString("utf8")
      : encodedContent;
    return { content, sha: response.sha ?? null };
  } catch (error) {
    if (error instanceof Error && error.message === "GitHub publishing is not configured for CU.") {
      return { content: await getLocalFileContent(path), sha: null };
    }
    throw error;
  }
}

export async function previewCuPublish(input: CuDraftInput) {
  const current = await getRepositoryFileContent(input.destination);
  const mergedContent = mergeCuContent(current.content, input.content, input.mode);
  return {
    path: input.destination,
    existed: Boolean(current.sha || current.content),
    mergedContent,
  };
}

export async function publishCuContent(input: CuDraftInput) {
  const { branch } = getGithubConfig();
  const current = await getRepositoryFileContent(input.destination);
  const mergedContent = mergeCuContent(current.content, input.content, input.mode);

  const response = await githubRequest<GithubContentUpdateResponse>(`/contents/${toGithubContentsPath(input.destination)}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `CU publish: ${input.destination}`,
      content: Buffer.from(mergedContent, "utf8").toString("base64"),
      sha: current.sha ?? undefined,
      branch,
    }),
  });
  if (!response) {
    throw new Error("GitHub did not return a publish response.");
  }

  const commitSha = response.commit?.sha;
  if (!commitSha) {
    throw new Error("GitHub did not return a commit SHA for the CU publish.");
  }

  return {
    path: input.destination,
    existed: Boolean(current.sha || current.content),
    commitSha,
    commitUrl: response.commit?.html_url ?? null,
    mergedContent,
  };
}

export function summarizeDeploymentState(statuses: GithubCommitStatuses | null, checks: GithubCheckRuns | null) {
  const netlifyStatuses = (statuses?.statuses ?? []).filter((status) => {
    const haystack = `${status.context || ""} ${status.target_url || ""}`.toLowerCase();
    return haystack.includes("netlify");
  });
  const netlifyChecks = (checks?.check_runs ?? []).filter((check) => {
    const haystack = `${check.name || ""} ${check.details_url || ""}`.toLowerCase();
    return haystack.includes("netlify");
  });

  if (netlifyStatuses.some((status) => status.state === "failure" || status.state === "error")) {
    return { state: "failure" as GithubStatusState, detail: "Netlify deployment reported a failure." };
  }

  if (netlifyChecks.some((check) => check.conclusion === "failure" || check.conclusion === "timed_out" || check.conclusion === "cancelled")) {
    return { state: "failure" as GithubStatusState, detail: "Netlify deployment reported a failure." };
  }

  if (netlifyStatuses.some((status) => status.state === "success") || netlifyChecks.some((check) => check.conclusion === "success")) {
    return { state: "success" as GithubStatusState, detail: "Netlify deployment finished successfully." };
  }

  return { state: "pending" as GithubStatusState, detail: "Waiting for Netlify deployment status." };
}

export async function getCuDeploymentStatus(commitSha: string) {
  const statuses = await githubRequest<GithubCommitStatuses>(`/commits/${commitSha}/status`, {}, true);
  const checks = await githubRequest<GithubCheckRuns>(`/commits/${commitSha}/check-runs`, {}, true);
  return summarizeDeploymentState(statuses ?? null, checks ?? null);
}
