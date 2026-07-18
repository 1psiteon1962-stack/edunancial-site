import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

import type { CuPublishInput, CuPublishResult } from "@/lib/cu/types";

function safeFilename(value: string) {
  const source = basename(value);
  let result = "";
  let lastWasDash = false;

  for (const char of source) {
    const allowed =
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      (char >= "0" && char <= "9") ||
      char === "." ||
      char === "_" ||
      char === "-";

    if (allowed) {
      result += char;
      lastWasDash = char === "-";
      continue;
    }

    if (!lastWasDash) {
      result += "-";
      lastWasDash = true;
    }
  }

  while (result.startsWith("-") || result.startsWith(".")) {
    result = result.slice(1);
  }

  while (result.endsWith("-") || result.endsWith(".")) {
    result = result.slice(0, -1);
  }

  return result || "upload";
}

export function buildCuDestinationPath(file: CuPublishInput) {
  const fileName = safeFilename(file.name);
  const language = file.language === "spanish" ? "spanish" : "english";
  const track = file.track.toUpperCase();
  const level = `L${file.level}`;

  switch (file.category) {
    case "courses":
      return `content/curriculum/${track}/${level}/${fileName}`;
    case "books":
      return `content/books/${language}/${track}/${level}/${fileName}`;
    case "articles":
      return `content/articles/${language}/${track}/${level}/${fileName}`;
    case "resources":
      return `content/resources/${language}/${track}/${level}/${fileName}`;
    case "downloads":
    default:
      return `public/downloads/${language}/${track}/${level}/${fileName}`;
  }
}

async function githubRequest(path: string, init?: RequestInit) {
  const token = process.env.EDUNANCIAL_GITHUB_TOKEN;
  const owner = process.env.EDUNANCIAL_GITHUB_OWNER;
  const repo = process.env.EDUNANCIAL_GITHUB_REPO;

  if (!token || !owner || !repo) {
    throw new Error("GitHub publishing is not configured.");
  }

  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/vnd.github+json");
  headers.set("Content-Type", "application/json");
  headers.set("User-Agent", "edunancial-cu-workbench");
  headers.set("Authorization", ["Bearer", token].join(" "));

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub publish failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function publishToGitHub(prepared: Array<{ destination: string; content: Buffer }>) {
  const baseBranch = process.env.EDUNANCIAL_GITHUB_BASE_BRANCH || "main";
  const ref = await githubRequest(`/git/ref/heads/${baseBranch}`);
  const baseSha = (ref.object as { sha: string }).sha;
  const baseCommit = await githubRequest(`/git/commits/${baseSha}`);
  const blobs = await Promise.all(
    prepared.map(async (file) => {
      const blob = await githubRequest("/git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: file.content.toString("base64"), encoding: "base64" }),
      });
      return { path: file.destination, mode: "100644", type: "blob", sha: blob.sha };
    }),
  );

  const tree = await githubRequest("/git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: (baseCommit.tree as { sha: string }).sha, tree: blobs }),
  });

  const commit = await githubRequest("/git/commits", {
    method: "POST",
    body: JSON.stringify({
      message: `Publish ${prepared.length} CU file(s)`,
      tree: tree.sha,
      parents: [baseSha],
    }),
  });

  await githubRequest(`/git/refs/heads/${baseBranch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return { mode: "github" as const, commitSha: commit.sha as string };
}

async function publishToFilesystem(prepared: Array<{ destination: string; content: Buffer }>) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("GitHub publishing must be configured for CU in production.");
  }

  for (const file of prepared) {
    const fullPath = join(process.cwd(), ...file.destination.split("/"));
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, file.content);
  }

  return { mode: "filesystem" as const, commitSha: null };
}

export async function publishCuFiles(files: CuPublishInput[]) {
  const prepared = files.map((file) => ({
    id: file.id,
    destination: buildCuDestinationPath(file),
    content: Buffer.from(file.contentBase64, "base64"),
  }));

  const publisher = process.env.EDUNANCIAL_GITHUB_TOKEN ? publishToGitHub : publishToFilesystem;
  const outcome = await publisher(prepared);
  const results: CuPublishResult[] = prepared.map((file) => ({ id: file.id, destination: file.destination, published: true }));

  return { ...outcome, results };
}

export const cuPublishInternals = {
  safeFilename,
};
