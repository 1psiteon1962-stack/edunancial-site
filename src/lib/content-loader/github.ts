import { composeNextContent, type ContentLoaderMode } from "@/lib/content-loader/content";

type PublishMetadata = {
  color: string;
  level: string;
  language: string;
  category: string;
};

type PublishParams = {
  destination: string;
  incomingContent: string;
  mode: ContentLoaderMode;
  actor: string;
  metadata: PublishMetadata;
};

type GithubFileResponse = {
  sha: string;
  content: string;
  encoding: string;
};

function getGithubConfig() {
  const token = process.env.EDUNANCIAL_GITHUB_TOKEN;
  const owner = process.env.EDUNANCIAL_GITHUB_OWNER;
  const repo = process.env.EDUNANCIAL_GITHUB_REPO;
  const branch = process.env.EDUNANCIAL_GITHUB_BASE_BRANCH || "main";

  if (!token || !owner || !repo) {
    throw new Error("GitHub publishing requires EDUNANCIAL_GITHUB_TOKEN, EDUNANCIAL_GITHUB_OWNER, and EDUNANCIAL_GITHUB_REPO.");
  }

  return { token, owner, repo, branch };
}

function encodeRepositoryPath(destination: string) {
  return destination
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function githubFetch(path: string, init: RequestInit = {}) {
  const { token, owner, repo } = getGithubConfig();
  return fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}

async function readExistingGithubFile(destination: string, branch: string): Promise<{ sha: string; content: string } | null> {
  const response = await githubFetch(`/contents/${encodeRepositoryPath(destination)}?ref=${encodeURIComponent(branch)}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Unable to read ${destination} from GitHub (${response.status}).`);
  }

  const data = await response.json() as GithubFileResponse;
  if (data.encoding !== "base64") {
    throw new Error(`Unexpected GitHub file encoding for ${destination}.`);
  }
  const normalizedContent = data.content.replaceAll("\n", "");
  return {
    sha: data.sha,
    content: Buffer.from(normalizedContent, "base64").toString("utf8"),
  };
}

export async function publishDestinationToGithub({ destination, incomingContent, mode, actor, metadata }: PublishParams) {
  const { owner, repo, branch } = getGithubConfig();
  const existing = await readExistingGithubFile(destination, branch);
  const nextContent = composeNextContent(existing?.content ?? "", incomingContent, mode);
  const commitMessage =
    `content-loader: ${mode} ${destination} [${metadata.language}|${metadata.category}|${metadata.color}|L${metadata.level}] by ${actor}`;

  const response = await githubFetch(`/contents/${encodeRepositoryPath(destination)}`, {
    method: "PUT",
    body: JSON.stringify({
      message: commitMessage,
      content: Buffer.from(nextContent, "utf8").toString("base64"),
      sha: existing?.sha,
      branch,
    }),
  });
  if (!response.ok) {
    throw new Error(`GitHub publish failed (${response.status}): ${await response.text()}`);
  }

  const data = await response.json() as {
    content?: { html_url?: string; path?: string };
    commit?: { sha?: string; html_url?: string };
  };
  const commitSha = data.commit?.sha ?? "";
  const commitUrl = data.commit?.html_url ?? (commitSha ? `https://github.com/${owner}/${repo}/commit/${commitSha}` : "");

  return {
    destination,
    branch,
    updated: true,
    commitSha,
    commitUrl,
    fileUrl: data.content?.html_url ?? "",
    mode,
    previousSha: existing?.sha ?? null,
  };
}
