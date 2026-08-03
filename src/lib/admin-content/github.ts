import type { ExportPackage, UploadBatch } from "@/lib/admin-content/types";
import { slugify } from "@/lib/admin-content/utils";
import {
  buildRegistryEntry,
  detectBundledCurriculumLessons,
  detectCurriculumAsset,
  upsertRegistryEntries,
  validateCurriculumFiles,
  type CurriculumRegistry,
} from "@/lib/admin-content/curriculum";
import { verifyDestinationPath } from "@/lib/admin-content/security";

const CURRICULUM_REGISTRY_PATH = "curriculum/registry.json";

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

/**
 * Fetch the current curriculum/registry.json from the default branch via the
 * GitHub Contents API.  Returns null when the file does not yet exist so the
 * caller can start from an empty registry on the first import.
 */
async function fetchCurrentRegistry(): Promise<CurriculumRegistry | null> {
  try {
    const data = await githubRequest(`/contents/${CURRICULUM_REGISTRY_PATH}`);
    if (!data.content || typeof data.content !== "string") return null;
    const raw = Buffer.from(data.content as string, "base64").toString("utf8");
    return JSON.parse(raw) as CurriculumRegistry;
  } catch {
    return null;
  }
}

export async function createGithubPullRequest(batch: UploadBatch, exportPackage: ExportPackage) {
  const approvedFiles = batch.files.filter((file) => file.reviewStatus === "approved");

  if (approvedFiles.length === 0) {
    throw new Error("No approved files to publish. Approve at least one file before publishing.");
  }

  // ---------------------------------------------------------------------------
  // Phase 1: resolve the final destination for each approved file.
  //
  // For files that contain valid curriculum front-matter (id: TRACK-L{n}-{nnn})
  // we override the destination to the canonical curriculum path
  // `content/curriculum/{TRACK}/L{n}/{id}.md`.  This ensures that uploading
  // RED-Level-1-Combined.md or any other lesson markdown causes the lesson to
  // land at the correct path and become discoverable through the curriculum
  // system without requiring any manual code changes.
  // ---------------------------------------------------------------------------
  const ingestionId = crypto.randomUUID();
  const ingestionTimestamp = new Date().toISOString();

  type ResolvedFile = (typeof approvedFiles)[number] & {
    resolvedDestination: string;
    curriculumAsset: Awaited<ReturnType<typeof detectCurriculumAsset>>;
    bundledLessons: Awaited<ReturnType<typeof detectBundledCurriculumLessons>>;
  };

  const resolvedFiles: ResolvedFile[] = await Promise.all(
    approvedFiles.map(async (file) => {
      const rawContent = file.rawText ?? Buffer.from(file.encodedContent, "base64").toString("utf8");
      const curriculumAsset = file.extension === ".md" ? await detectCurriculumAsset(rawContent) : null;
      const bundledLessons =
        file.extension === ".md" && !curriculumAsset
          ? await detectBundledCurriculumLessons(rawContent)
          : [];
      const resolvedDestination = curriculumAsset
        ? curriculumAsset.canonicalPath
        : verifyDestinationPath(file.classification.destination || file.metadata.intendedDestination);
      return { ...file, resolvedDestination, curriculumAsset, bundledLessons };
    }),
  );

  const bundledCurriculumFiles = resolvedFiles.flatMap((file) =>
    file.bundledLessons.map((lesson) => ({
      sourceFileId: file.id,
      destination: lesson.asset.canonicalPath,
      content: lesson.content,
      asset: lesson.asset,
    })),
  );

  // Detect in-batch duplicate destination paths before hitting the GitHub API.
  const destinationCounts = resolvedFiles.reduce<Record<string, number>>((acc, file) => {
    acc[file.resolvedDestination] = (acc[file.resolvedDestination] ?? 0) + 1;
    return acc;
  }, {});
  for (const bundledFile of bundledCurriculumFiles) {
    destinationCounts[bundledFile.destination] = (destinationCounts[bundledFile.destination] ?? 0) + 1;
  }
  const duplicateDestinations = Object.entries(destinationCounts)
    .filter(([, count]) => count > 1)
    .map(([dest]) => dest);
  if (duplicateDestinations.length > 0) {
    throw new Error(
      `Multiple approved files share the same destination path — resolve conflicts before publishing: ${duplicateDestinations.join(", ")}`,
    );
  }

  const validation = await validateCurriculumFiles(
    [
      ...resolvedFiles.map((file) => ({
        destination: file.resolvedDestination,
        content: file.rawText ?? "",
      })),
      ...bundledCurriculumFiles.map((file) => ({
        destination: file.destination,
        content: file.content,
      })),
    ],
  );
  if (!validation.success) {
    throw new Error(`GitHub export blocked by curriculum validation: ${validation.errors.join("; ")}`);
  }

  const owner = process.env.EDUNANCIAL_GITHUB_OWNER as string;
  const repo = process.env.EDUNANCIAL_GITHUB_REPO as string;
  const baseBranch = process.env.EDUNANCIAL_GITHUB_BASE_BRANCH || DEFAULT_BASE_BRANCH;
  const batchSlug = slugify(batch.name);
  // Branch name includes full timestamp (YYYYMMDD-HHMMSS) for predictability and uniqueness.
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replaceAll("-", "");
  const timePart = now.toISOString().slice(11, 19).replaceAll(":", "");
  const branchName = `content/course-upload-${datePart}-${timePart}-${batchSlug}`;

  const refData = await githubRequest(`/git/ref/heads/${baseBranch}`);
  const baseSha = (refData.object as { sha: string }).sha;
  await githubRequest("/git/refs", {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha }),
  });

  const blobs = await Promise.all(
    resolvedFiles.map(async (file) => {
      const blob = await githubRequest("/git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: Buffer.from(file.encodedContent, "base64").toString("base64"), encoding: "base64" }),
      });
      return { path: file.resolvedDestination, mode: "100644", type: "blob", sha: blob.sha as string };
    }),
  );

  const bundledLessonBlobs = await Promise.all(
    bundledCurriculumFiles.map(async (file) => {
      const blob = await githubRequest("/git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: Buffer.from(file.content, "utf8").toString("base64"), encoding: "base64" }),
      });
      return { path: file.destination, mode: "100644", type: "blob", sha: blob.sha as string };
    }),
  );
  blobs.push(...bundledLessonBlobs);

  // ---------------------------------------------------------------------------
  // Phase 2: if any files are curriculum assets, fetch the current registry and
  // build an updated version that includes the new entries.  The updated
  // registry is included in the same commit so the lesson becomes discoverable
  // immediately after the PR is merged and the site is redeployed — no manual
  // `npm run curriculum:import` or code changes are required.
  // ---------------------------------------------------------------------------
  const curriculumFiles = resolvedFiles.filter((f) => f.curriculumAsset !== null);
  const totalCurriculumAssets = curriculumFiles.length + bundledCurriculumFiles.length;
  let registryIncludedInPr = false;

  if (totalCurriculumAssets > 0) {
    // Registry update is MANDATORY for curriculum assets.  If it fails the PR
    // must not be created — a partial commit (content without registry) would
    // leave the lesson unreachable on the live site and break the pipeline.
    const existingRegistry = await fetchCurrentRegistry();
    const directEntries = curriculumFiles.map((file) => {
      const contentBytes = Buffer.from(file.encodedContent, "base64");
      return buildRegistryEntry(
        file.curriculumAsset!,
        contentBytes,
        ingestionId,
        ingestionTimestamp,
        file.checksum ? `sha256:${file.checksum}` : undefined,
      );
    });
    const bundledEntries = bundledCurriculumFiles.map((file) => {
      const contentBytes = Buffer.from(file.content, "utf8");
      return buildRegistryEntry(file.asset, contentBytes, ingestionId, ingestionTimestamp);
    });
    const newEntries = [...directEntries, ...bundledEntries];
    const updatedRegistry = upsertRegistryEntries(existingRegistry, newEntries);
    const registryBlob = await githubRequest("/git/blobs", {
      method: "POST",
      body: JSON.stringify({
        content: Buffer.from(JSON.stringify(updatedRegistry, null, 2) + "\n").toString("base64"),
        encoding: "base64",
      }),
    });
    blobs.push({
      path: CURRICULUM_REGISTRY_PATH,
      mode: "100644",
      type: "blob",
      sha: registryBlob.sha as string,
    });
    registryIncludedInPr = true;
  }

  // Rich manifest: includes per-file metadata for traceability.
  const manifestEntries = resolvedFiles.map((file) => ({
    sourceFilename: file.originalFilename,
    destinationPath: file.resolvedDestination,
    title: file.metadata.title,
    track: file.metadata.pillar,
    level: file.metadata.academyLevel,
    language: file.metadata.language,
    region: file.metadata.region,
    membership: file.metadata.contentType,
    batchId: batch.id,
    uploadTimestamp: file.updatedAt,
    checksum: file.checksum,
    curriculumAssetId: file.curriculumAsset?.id ?? null,
  }));
  const manifest = {
    batchId: batch.id,
    exportId: exportPackage.id,
    uploadTimestamp: now.toISOString(),
    branch: branchName,
    files: manifestEntries,
    validation,
    registryUpdated: registryIncludedInPr,
    curriculumAssets: totalCurriculumAssets,
  };
  const manifestBlob = await githubRequest("/git/blobs", {
    method: "POST",
    body: JSON.stringify({
      content: Buffer.from(JSON.stringify(manifest, null, 2)).toString("base64"),
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
    approved: resolvedFiles.length,
    rejected: batch.files.filter((file) => file.reviewStatus === "rejected").length,
    duplicates: batch.files.filter((file) => file.conflictStatus === "exact-duplicate" || file.conflictStatus === "probable-duplicate").length,
    conflicts: batch.files.filter((file) => file.conflictStatus === "destination-conflict" || file.conflictStatus === "classification-conflict").length,
  };
  const destinationSummary = resolvedFiles.reduce<Record<string, number>>((accumulator, file) => {
    const key = file.resolvedDestination;
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
        `Curriculum assets: ${totalCurriculumAssets}`,
        `Registry updated in PR: ${registryIncludedInPr}`,
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
