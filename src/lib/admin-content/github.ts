import type { ExportPackage, UploadBatch } from "@/lib/admin-content/types";
import { slugify } from "@/lib/admin-content/utils";
import { validateCurriculumFiles } from "@/lib/admin-content/curriculum";
import { verifyDestinationPath } from "@/lib/admin-content/security";

const DEFAULT_BASE_BRANCH = "main";

async function githubRequest(path: string, init: RequestInit = {}) {
  const token = process.env.EDUNANCIAL_GITHUB_TOKEN;
  const owner = process.env.EDUNANCIAL_GITHUB_OWNER;
  const repo = process.env.EDUNANCIAL_GITHUB_REPO;
  if (!token || !owner || !repo) {
    throw new Error("GitHub integration requires EDUNANCIAL_GITHUB_TOKEN, EDUNANCIAL_GITHUB_OWNER, and EDUNANCIAL_GITHUB_REPO.");
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`GitHub API request failed (${response.status}): ${await response.text()}`);
  }
  return response.json() as Promise<Record<string, unknown>>;
}

export async function createGithubPullRequest(batch: UploadBatch, exportPackage: ExportPackage) {
  const approvedFiles = batch.files.filter((file) => file.reviewStatus === "approved");
  const validation = await validateCurriculumFiles(
    approvedFiles.map((file) => ({
      destination: verifyDestinationPath(file.classification.destination || file.metadata.intendedDestination),
      content: file.rawText,
    })),
  );
  if (!validation.success) {
    throw new Error(`GitHub export blocked by curriculum validation: ${validation.errors.join("; ")}`);
  }

  const owner = process.env.EDUNANCIAL_GITHUB_OWNER as string;
  const repo = process.env.EDUNANCIAL_GITHUB_REPO as string;
  const baseBranch = process.env.EDUNANCIAL_GITHUB_BASE_BRANCH || DEFAULT_BASE_BRANCH;
  const batchSlug = slugify(batch.name);
  const branchName = `content-upload/${new Date().toISOString().slice(0, 10)}-${batchSlug}`;

  const refData = await githubRequest(`/git/ref/heads/${baseBranch}`);
  const baseSha = (refData.object as { sha: string }).sha;
  await githubRequest("/git/refs", {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha }),
  });

  const blobs = await Promise.all(
    approvedFiles.map(async (file) => {
      const destination = verifyDestinationPath(file.classification.destination || file.metadata.intendedDestination);
      const blob = await githubRequest("/git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: Buffer.from(file.encodedContent, "base64").toString("base64"), encoding: "base64" }),
      });
      return { path: destination, mode: "100644", type: "blob", sha: blob.sha as string };
    }),
  );

  const manifestBlob = await githubRequest("/git/blobs", {
    method: "POST",
    body: JSON.stringify({
      content: Buffer.from(JSON.stringify({ batchId: batch.id, exportId: exportPackage.id, validation }, null, 2)).toString("base64"),
      encoding: "base64",
    }),
  });
  blobs.push({
    path: exportPackage.manifestPath,
    mode: "100644",
    type: "blob",
    sha: manifestBlob.sha as string,
  });

  const baseCommit = await githubRequest(`/git/commits/${baseSha}`);
  const newTree = await githubRequest("/git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: (baseCommit.tree as { sha: string }).sha, tree: blobs }),
  });
  const commit = await githubRequest("/git/commits", {
    method: "POST",
    body: JSON.stringify({
      message: `Content upload: ${batch.name}`,
      tree: newTree.sha,
      parents: [baseSha],
    }),
  });

  await githubRequest(`/git/refs/heads/${branchName}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  const counts = {
    approved: approvedFiles.length,
    rejected: batch.files.filter((file) => file.reviewStatus === "rejected").length,
    duplicates: batch.files.filter((file) => file.conflictStatus === "exact-duplicate" || file.conflictStatus === "probable-duplicate").length,
    conflicts: batch.files.filter((file) => file.conflictStatus === "destination-conflict" || file.conflictStatus === "classification-conflict").length,
  };
  const destinationSummary = approvedFiles.reduce<Record<string, number>>((accumulator, file) => {
    const key = file.classification.destination;
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  const pr = await githubRequest("/pulls", {
    method: "POST",
    body: JSON.stringify({
      title: `Content upload: ${batch.name}`,
      head: branchName,
      base: baseBranch,
      body: [
        `Batch ID: ${batch.id}`,
        `Upload source: ${batch.source}`,
        `Approved: ${counts.approved}`,
        `Rejected: ${counts.rejected}`,
        `Duplicates: ${counts.duplicates}`,
        `Conflicts: ${counts.conflicts}`,
        `Validation success: ${validation.success}`,
        `Validation warnings: ${validation.warnings.join("; ") || "None"}`,
        `Destination summary: ${Object.entries(destinationSummary).map(([path, count]) => `${count} -> ${path}`).join(", ")}`,
      ].join("\n"),
    }),
  });

  return {
    branch: branchName,
    pullRequestUrl: pr.html_url as string,
    pullRequestNumber: pr.number as number,
    owner,
    repo,
  };
}
