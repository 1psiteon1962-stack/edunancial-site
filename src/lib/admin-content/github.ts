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
import { getAuthoritativePublishedLessonIds } from "@/lib/admin-content/published-canonical";
import { verifyDestinationPath } from "@/lib/admin-content/security";

const CURRICULUM_REGISTRY_PATH = "curriculum/registry.json";
const DEFAULT_BASE_BRANCH = "main";
const CANONICAL_LESSON_ID_RE = /^[A-Z][A-Z0-9]*-L[1-9][0-9]*-[0-9]{3,}$/u;

type CurriculumTranslationJson = {
  lessonId: string;
  locales: string[];
};

function getRequiredGithubConfig() {
  const token = process.env.EDUNANCIAL_GITHUB_TOKEN;
  const owner = process.env.EDUNANCIAL_GITHUB_OWNER;
  const repo = process.env.EDUNANCIAL_GITHUB_REPO;

  if (!token || !owner || !repo) {
    throw new Error("GitHub integration requires EDUNANCIAL_GITHUB_TOKEN, EDUNANCIAL_GITHUB_OWNER, and EDUNANCIAL_GITHUB_REPO.");
  }

  return { token, owner, repo };
}

async function githubRequest(path: string, init: RequestInit = {}) {
  const { token, owner, repo } = getRequiredGithubConfig();

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

function activeLessonIds(registry: CurriculumRegistry | null): Set<string> {
  const ids = new Set<string>();
  if (!registry || typeof registry !== "object") return ids;

  const tracks = (registry as unknown as { tracks?: Record<string, { levels?: Record<string, { assets?: Record<string, { id?: string; type?: string; status?: string }> }> }> }).tracks;
  for (const track of Object.values(tracks ?? {})) {
    for (const level of Object.values(track.levels ?? {})) {
      for (const asset of Object.values(level.assets ?? {})) {
        if (asset?.type !== "lesson" || asset?.status !== "active") continue;
        const id = String(asset.id ?? "").toUpperCase();
        if (id) ids.add(id);
      }
    }
  }
  return ids;
}

function detectTranslationJson(content: string): CurriculumTranslationJson | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const record = parsed as Record<string, unknown>;
  const translations = record.translations;
  if (!translations || typeof translations !== "object" || Array.isArray(translations)) return null;

  const lessonId = String(record.lessonId ?? record.lesson_id ?? record.id ?? "").toUpperCase();
  if (!CANONICAL_LESSON_ID_RE.test(lessonId)) return null;

  const locales = Object.keys(translations);
  if (locales.length === 0) {
    throw new Error(`Curriculum translation JSON for ${lessonId} has an empty translations object.`);
  }

  for (const locale of locales) {
    const translation = (translations as Record<string, unknown>)[locale];
    if (!translation || typeof translation !== "object" || Array.isArray(translation)) {
      throw new Error(`Curriculum translation JSON for ${lessonId} has invalid locale payload: ${locale}.`);
    }
  }

  return { lessonId, locales };
}

export async function createGithubPullRequest(batch: UploadBatch, exportPackage: ExportPackage) {
  const approvedFiles = batch.files.filter((file) => file.reviewStatus === "approved");

  if (approvedFiles.length === 0) {
    throw new Error("No approved files to publish. Approve at least one file before publishing.");
  }

  const { owner, repo } = getRequiredGithubConfig();
  const existingRegistryAtStart = await fetchCurrentRegistry();
  const existingLessonIds = activeLessonIds(existingRegistryAtStart);
  const publishedLessonIds = await getAuthoritativePublishedLessonIds();
  for (const id of publishedLessonIds) existingLessonIds.add(id);

  const ingestionId = crypto.randomUUID();
  const ingestionTimestamp = new Date().toISOString();

  type ResolvedFile = (typeof approvedFiles)[number] & {
    resolvedDestination: string;
    curriculumAsset: Awaited<ReturnType<typeof detectCurriculumAsset>>;
    bundledLessons: Awaited<ReturnType<typeof detectBundledCurriculumLessons>>;
    curriculumTranslation: CurriculumTranslationJson | null;
    translationBlockedReason: string | null;
  };

  const resolvedCandidates: ResolvedFile[] = await Promise.all(
    approvedFiles.map(async (file) => {
      const originalContent = Buffer.from(file.encodedContent, "base64").toString("utf8");
      const curriculumAsset = file.extension === ".md"
        ? await detectCurriculumAsset(originalContent, file.originalFilename)
        : null;
      const bundledLessons =
        file.extension === ".md" && !curriculumAsset
          ? await detectBundledCurriculumLessons(originalContent)
          : [];
      const curriculumTranslation = file.extension === ".json"
        ? detectTranslationJson(originalContent)
        : null;

      const translationBlockedReason =
        curriculumTranslation && !existingLessonIds.has(curriculumTranslation.lessonId)
          ? `${file.originalFilename} references ${curriculumTranslation.lessonId}, but that canonical lesson is not active in the repository registry or authoritative published curriculum state.`
          : null;

      const resolvedDestination = curriculumAsset
        ? curriculumAsset.destinationPath
        : verifyDestinationPath(file.classification.destination || file.metadata.intendedDestination);
      return {
        ...file,
        resolvedDestination,
        curriculumAsset,
        bundledLessons,
        curriculumTranslation,
        translationBlockedReason,
      };
    }),
  );

  // Translation files are overlays only. They may never create canonical lesson
  // identities. Quarantine orphan translations instead of failing the entire
  // approved batch so valid translations can continue through publication.
  const blockedTranslationFiles = resolvedCandidates.filter((file) => file.translationBlockedReason !== null);
  const resolvedFiles = resolvedCandidates.filter((file) => file.translationBlockedReason === null);

  if (resolvedFiles.length === 0) {
    const blockedLessonIds = blockedTranslationFiles
      .map((file) => file.curriculumTranslation?.lessonId)
      .filter((value): value is string => Boolean(value));
    throw new Error(
      `No publishable approved files remain. ${blockedTranslationFiles.length} orphan curriculum translation file(s) were quarantined because their canonical lessons are not active in the repository registry or authoritative published curriculum state. ` +
      `Blocked lesson IDs: ${blockedLessonIds.join(", ") || "unknown"}. Publish canonical lessons first; translations may not create lesson identities.`,
    );
  }

  const bundledCurriculumFiles = resolvedFiles.flatMap((file) =>
    file.bundledLessons.map((lesson) => ({
      sourceFileId: file.id,
      destination: lesson.asset.canonicalPath,
      content: lesson.content,
      asset: lesson.asset,
    })),
  );

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
        content: Buffer.from(file.encodedContent, "base64").toString("utf8"),
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

  const baseBranch = process.env.EDUNANCIAL_GITHUB_BASE_BRANCH || DEFAULT_BASE_BRANCH;
  const batchSlug = slugify(batch.name);
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

  const curriculumFiles = resolvedFiles.filter((f) => f.curriculumAsset !== null);
  const curriculumTranslationFiles = resolvedFiles.filter((f) => f.curriculumTranslation !== null);
  const totalCurriculumAssets = curriculumFiles.length + bundledCurriculumFiles.length;
  const totalCurriculumTranslations = curriculumTranslationFiles.length;
  const totalTranslationLocales = curriculumTranslationFiles.reduce(
    (sum, file) => sum + (file.curriculumTranslation?.locales.length ?? 0),
    0,
  );
  let registryIncludedInPr = false;

  if (totalCurriculumAssets > 0) {
    const existingRegistry = existingRegistryAtStart;
    const directEntries = curriculumFiles
      .filter((file) => !file.curriculumAsset?.locale)
      .map((file) => {
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
    curriculumTranslationLessonId: file.curriculumTranslation?.lessonId ?? null,
    curriculumTranslationLocales: file.curriculumTranslation?.locales ?? [],
  }));
  const quarantinedTranslations = blockedTranslationFiles.map((file) => ({
    sourceFilename: file.originalFilename,
    lessonId: file.curriculumTranslation?.lessonId ?? null,
    locales: file.curriculumTranslation?.locales ?? [],
    reason: file.translationBlockedReason,
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
    curriculumTranslations: totalCurriculumTranslations,
    curriculumTranslationLocales: totalTranslationLocales,
    quarantinedCurriculumTranslations: quarantinedTranslations,
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
    approved: approvedFiles.length,
    published: resolvedFiles.length,
    quarantinedTranslations: blockedTranslationFiles.length,
    rejected: batch.files.filter((file) => file.reviewStatus === "rejected").length,
    duplicates: batch.files.filter((file) => file.conflictStatus === "exact-duplicate" || file.conflictStatus === "probable-duplicate").length,
    conflicts: batch.files.filter((file) => file.conflictStatus === "destination-conflict" || file.conflictStatus === "classification-conflict").length,
  };
  const destinationSummary = resolvedFiles.reduce<Record<string, number>>((accumulator, file) => {
    const key = file.resolvedDestination;
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
  const translationSummary = curriculumTranslationFiles.map((file) => {
    const translation = file.curriculumTranslation!;
    return `${translation.lessonId} [${translation.locales.join(", ")}]`;
  });
  const quarantinedSummary = blockedTranslationFiles.map((file) =>
    `${file.curriculumTranslation?.lessonId ?? file.originalFilename} (${file.originalFilename})`,
  );

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
        `Published in this PR: ${counts.published}`,
        `Quarantined orphan translations: ${counts.quarantinedTranslations}`,
        `Rejected: ${counts.rejected}`,
        `Duplicates: ${counts.duplicates}`,
        `Conflicts: ${counts.conflicts}`,
        `Curriculum assets: ${totalCurriculumAssets}`,
        `Curriculum translation files: ${totalCurriculumTranslations}`,
        `Curriculum translation locales: ${totalTranslationLocales}`,
        `Translation lessons: ${translationSummary.join("; ") || "None"}`,
        `Quarantined translation lessons: ${quarantinedSummary.join("; ") || "None"}`,
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
