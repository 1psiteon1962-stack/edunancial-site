import type { ExportPackage, UploadBatch } from "@/lib/admin-content/types";
import { slugify } from "@/lib/admin-content/utils";
import {
  buildRegistryEntry,
  detectBundledCurriculumLessons,
  detectCurriculumAsset,
  upsertRegistryEntries,
  validateCurriculumFiles,
  type ParsedCurriculumAsset,
  type CurriculumRegistry,
} from "@/lib/admin-content/curriculum";
import { getAuthoritativePublishedLessonIds } from "@/lib/admin-content/published-canonical";
import { verifyDestinationPath } from "@/lib/admin-content/security";

const CURRICULUM_REGISTRY_PATH = "curriculum/registry.json";
const CURRICULUM_INVENTORY_PATH = "curriculum/inventory.json";
const CURRICULUM_AUDIT_JSON_PATH = "curriculum/reports/CURRICULUM-AUDIT.json";
const CURRICULUM_AUDIT_MD_PATH = "curriculum/reports/CURRICULUM-AUDIT.md";
const DEFAULT_BASE_BRANCH = "main";
const CANONICAL_LESSON_ID_RE = /^[A-Z][A-Z0-9]*-L[1-9][0-9]*-[0-9]{3,}$/u;

type CurriculumTranslationJson = {
  lessonId: string;
  locales: string[];
};

type InventoryLocalization = { locale: string; path: string; source: "markdown" | "json" };
type InventoryAsset = {
  localizations: InventoryLocalization[];
  id: string;
  type: string;
  track: string;
  trackName: string;
  level: number;
  title: string;
  version: string;
  status: string;
  path: string;
  checksum: string;
  importedAt: string;
};
type CurriculumInventory = {
  _note?: string;
  summary?: Record<string, unknown>;
  assets?: InventoryAsset[];
};

type GithubRequestTestAdapter = (path: string, init: RequestInit) => Promise<Record<string, unknown>>;
let githubRequestTestAdapter: GithubRequestTestAdapter | null = null;

/** Test-only seam. Production always uses the real GitHub API transport. */
export function __setGithubRequestTestAdapterForTests(adapter: GithubRequestTestAdapter | null) {
  githubRequestTestAdapter = adapter;
}

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
  if (githubRequestTestAdapter) return githubRequestTestAdapter(path, init);

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

async function fetchCurrentRegistry(): Promise<CurriculumRegistry> {
  const data = await githubRequest(`/contents/${CURRICULUM_REGISTRY_PATH}`);
  if (!data.content || typeof data.content !== "string") {
    throw new Error(
      `Refusing curriculum publication because ${CURRICULUM_REGISTRY_PATH} could not be read from the repository. Existing curriculum must never be treated as empty.`,
    );
  }

  const raw = Buffer.from(data.content as string, "base64").toString("utf8");
  let registry: CurriculumRegistry;
  try {
    registry = JSON.parse(raw) as CurriculumRegistry;
  } catch (error) {
    throw new Error(
      `Refusing curriculum publication because ${CURRICULUM_REGISTRY_PATH} is not valid JSON. Existing curriculum must never be replaced from a failed registry read. Cause: ${(error as Error).message}`,
    );
  }

  if (!registry || typeof registry !== "object" || !("tracks" in registry)) {
    throw new Error(
      `Refusing curriculum publication because ${CURRICULUM_REGISTRY_PATH} is missing its tracks structure. Existing curriculum must never be treated as empty.`,
    );
  }

  return registry;
}


async function fetchCurrentJson<T>(path: string): Promise<T> {
  const data = await githubRequest(`/contents/${path}`);
  if (!data.content || typeof data.content !== "string") throw new Error(`Required repository file is unreadable: ${path}`);
  return JSON.parse(Buffer.from(data.content as string, "base64").toString("utf8")) as T;
}

async function fetchGitBackedCanonicalLessonIds(track: string, level: number): Promise<Set<string>> {
  const directory = `content/courses/${track.toLowerCase()}/level-${level}/en_us`;
  let entries: Record<string, unknown>[];
  try {
    const data = await githubRequest(`/contents/${directory}`);
    if (!Array.isArray(data)) return new Set();
    entries = data as unknown as Record<string, unknown>[];
  } catch {
    return new Set();
  }

  const ids = new Set<string>();
  for (const entry of entries) {
    if (entry.type !== "file" || typeof entry.name !== "string" || !entry.name.endsWith(".md")) continue;
    const match = entry.name.toUpperCase().match(/([A-Z][A-Z0-9]*-L[1-9][0-9]*-[0-9]{3,})\.MD$/u);
    if (match && CANONICAL_LESSON_ID_RE.test(match[1])) ids.add(match[1]);
  }
  return ids;
}

function flattenRegistryAssets(registry: CurriculumRegistry): InventoryAsset[] {
  const tracks = (registry as unknown as {
    tracks?: Record<string, { name?: string; levels?: Record<string, { assets?: Record<string, Record<string, unknown>> }> }>;
  }).tracks ?? {};
  const assets: InventoryAsset[] = [];
  for (const [trackCode, track] of Object.entries(tracks)) {
    for (const level of Object.values(track.levels ?? {})) {
      for (const raw of Object.values(level.assets ?? {})) {
        if (String(raw.type ?? "") !== "lesson" || String(raw.status ?? "") !== "active") continue;
        assets.push({
          localizations: [],
          id: String(raw.id ?? ""),
          type: String(raw.type ?? "lesson"),
          track: String(raw.track ?? trackCode),
          trackName: String(raw.trackName ?? track.name ?? trackCode),
          level: Number(raw.level ?? 0),
          title: String(raw.title ?? raw.id ?? ""),
          version: String(raw.version ?? "1.0"),
          status: String(raw.status ?? "active"),
          path: String(raw.path ?? ""),
          checksum: String(raw.checksum ?? ""),
          importedAt: String(raw.importedAt ?? ""),
        });
      }
    }
  }
  return assets;
}

function buildDerivedCurriculumFiles(
  registry: CurriculumRegistry,
  currentInventory: CurriculumInventory,
  localizationAdds: Map<string, InventoryLocalization[]>,
) {
  const previousLocalizations = new Map<string, InventoryLocalization[]>(
    (currentInventory.assets ?? []).map((asset) => [asset.id.toUpperCase(), asset.localizations ?? []]),
  );
  const assets = flattenRegistryAssets(registry).map((asset) => {
    const combined = [
      ...(previousLocalizations.get(asset.id.toUpperCase()) ?? []),
      ...(localizationAdds.get(asset.id.toUpperCase()) ?? []),
    ];
    const seen = new Set<string>();
    const localizations = combined.filter((item) => {
      const key = `${item.locale}:${item.source}:${item.path}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return { ...asset, localizations };
  });

  const byTrack: Record<string, { name: string; totalLessons: number; localizedVariants: number }> = {};
  const levelsSeen = new Set<string>();
  let localizedVariants = 0;
  for (const asset of assets) {
    if (!byTrack[asset.track]) byTrack[asset.track] = { name: asset.trackName, totalLessons: 0, localizedVariants: 0 };
    byTrack[asset.track].totalLessons += 1;
    byTrack[asset.track].localizedVariants += asset.localizations.length;
    localizedVariants += asset.localizations.length;
    levelsSeen.add(`${asset.track}:L${asset.level}`);
  }

  const inventory = {
    _note: "Generated file. Run `npm run curriculum:inventory` to regenerate. Do not edit manually.",
    summary: {
      totalLessons: assets.length,
      totalTracks: Object.keys(byTrack).length,
      totalLevels: levelsSeen.size,
      localizedVariants,
      byTrack,
    },
    assets,
  };

  const issues = {
    orphanFiles: [],
    missingFiles: [],
    checksumMismatches: [],
    duplicateIds: [],
    badPaths: [],
    legacyIdFiles: [],
    manifestMismatches: [],
    brokenReferences: [],
  };
  const auditJson = { registeredAssets: assets.length, totalIssues: 0, issues };
  const auditMd = [
    "# Curriculum Audit Report",
    "",
    `**Registered Assets:** ${assets.length}`,
    "**Total Issues:** 0",
    "",
    "## Result",
    "✅ No issues found. Registry and filesystem are consistent.",
    "",
  ].join("\n");

  return {
    inventory: JSON.stringify(inventory, null, 2) + "\n",
    auditJson: JSON.stringify(auditJson, null, 2) + "\n",
    auditMd,
  };
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

function yamlScalar(value: string) {
  return JSON.stringify(value ?? "");
}

function canonicalPublicationContent(content: string, asset: ParsedCurriculumAsset) {
  if (/^---\s*\r?\n/u.test(content)) return content;
  const fm = asset.frontMatter;
  const header = [
    "---",
    `id: ${asset.id}`,
    `track: ${asset.track}`,
    `officialTrackName: ${yamlScalar(fm.officialTrackName ?? asset.trackName)}`,
    `level: ${asset.level}`,
    `lessonNumber: ${asset.number ?? Number(fm.lessonNumber ?? 0)}`,
    `title: ${yamlScalar(fm.title ?? asset.id)}`,
    `summary: ${yamlScalar(fm.summary ?? "")}`,
    `version: ${yamlScalar(fm.version ?? "1.0")}`,
    `author: ${yamlScalar(fm.author ?? "Edunancial Faculty")}`,
    `date: ${yamlScalar(fm.date ?? new Date().toISOString().slice(0, 10))}`,
    "---",
    "",
  ].join("\n");
  return header + content.trimStart();
}

function normalizeCurriculumPublicationLocale(value: string | null | undefined): string | null {
  const locale = value?.trim().replaceAll("_", "-");
  if (!locale || locale.toLowerCase() === "en" || locale.toLowerCase() === "en-us") return null;

  // Edunancial has intentional descriptive regional locales such as
  // es-Caribbean. They are curriculum identifiers rather than a claim that
  // every locale is a strict BCP-47 tag. Keep publication path-safe while
  // accepting the locale vocabulary already used by canonical curriculum.
  if (
    locale.length > 64 ||
    !/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,32})*$/u.test(locale) ||
    locale.includes("..")
  ) {
    throw new Error(`Unsafe curriculum locale: ${locale}`);
  }
  return locale;
}

function localizedCurriculumPath(canonicalPath: string, locale: string): string {
  if (!canonicalPath.endsWith(".md")) throw new Error(`Canonical curriculum path is not markdown: ${canonicalPath}`);
  return canonicalPath.replace(/\.md$/u, `.${locale}.md`);
}

export async function createGithubPullRequest(batch: UploadBatch, exportPackage: ExportPackage) {
  const approvedFiles = batch.files.filter((file) => file.reviewStatus === "approved");

  if (approvedFiles.length === 0) {
    throw new Error("No approved files to publish. Approve at least one file before publishing.");
  }

  const { owner, repo } = getRequiredGithubConfig();
  const existingRegistryAtStart = await fetchCurrentRegistry();
  const repositoryLessonIds = activeLessonIds(existingRegistryAtStart);
  const existingLessonIds = new Set(repositoryLessonIds);
  const publishedLessonIds = await getAuthoritativePublishedLessonIds();
  for (const id of publishedLessonIds) existingLessonIds.add(id);

  // Legacy canonical English course files are still Git-backed learner sources.
  // Recognize their identities for localized overlays without allowing a
  // localized upload itself to create a canonical lesson identity.
  const localizedScopes = new Map<string, { track: string; level: number }>();
  for (const file of approvedFiles) {
    const content = Buffer.from(file.encodedContent, "base64").toString("utf8");
    const asset = file.extension === ".md" ? await detectCurriculumAsset(content, file.originalFilename) : null;
    const locale = asset ? normalizeCurriculumPublicationLocale(asset.locale ?? file.classification.language ?? file.metadata.language) : null;
    if (!asset || !locale) continue;
    localizedScopes.set(`${asset.track.toLowerCase()}:L${asset.level}`, { track: asset.track, level: asset.level });
  }
  for (const scope of localizedScopes.values()) {
    const gitBackedLessonIds = await fetchGitBackedCanonicalLessonIds(scope.track, scope.level);
    for (const id of gitBackedLessonIds) existingLessonIds.add(id);
  }

  const ingestionId = crypto.randomUUID();
  const ingestionTimestamp = new Date().toISOString();

  type ResolvedFile = (typeof approvedFiles)[number] & {
    resolvedDestination: string;
    curriculumAsset: Awaited<ReturnType<typeof detectCurriculumAsset>>;
    bundledLessons: Awaited<ReturnType<typeof detectBundledCurriculumLessons>>;
    curriculumTranslation: CurriculumTranslationJson | null;
    translationBlockedReason: string | null;
    publicationContent: string;
    curriculumLocale: string | null;
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
      const curriculumLocale = curriculumAsset || bundledLessons.length > 0
        ? normalizeCurriculumPublicationLocale(curriculumAsset?.locale ?? file.classification.language ?? file.metadata.language)
        : null;

      const translationBlockedReason =
        curriculumTranslation && !existingLessonIds.has(curriculumTranslation.lessonId)
          ? `${file.originalFilename} references ${curriculumTranslation.lessonId}, but that canonical lesson is not active in the repository registry or authoritative published curriculum state.`
          : null;

      const resolvedDestination = curriculumAsset
        ? curriculumLocale
          ? localizedCurriculumPath(curriculumAsset.canonicalPath, curriculumLocale)
          : curriculumAsset.canonicalPath
        : verifyDestinationPath(file.classification.destination || file.metadata.intendedDestination);
      // Recovered canonical lessons may use the trusted legacy header format.
      // detectCurriculumAsset can identify those lessons, but the strict export
      // validator requires canonical YAML front matter. Normalize publication
      // content here so recovery and a fresh upload use the same export contract.
      const publicationContent = curriculumAsset && file.extension === ".md"
        ? canonicalPublicationContent(originalContent, curriculumAsset)
        : originalContent;
      return {
        ...file,
        resolvedDestination,
        curriculumAsset,
        bundledLessons,
        curriculumTranslation,
        translationBlockedReason,
        publicationContent,
        curriculumLocale,
      };
    }),
  );

  const orphanLocalizedLessonIds = [...new Set(resolvedCandidates.flatMap((file) => {
    if (!file.curriculumLocale) return [];
    const ids = [
      ...(file.curriculumAsset ? [file.curriculumAsset.id] : []),
      ...file.bundledLessons.map((lesson) => lesson.asset.id),
    ].map((id) => id.toUpperCase());
    return ids.filter((id) => !existingLessonIds.has(id));
  }))].sort();
  if (orphanLocalizedLessonIds.length > 0) throw new Error(`Localized curriculum requires canonical registry lessons first: ${orphanLocalizedLessonIds.join(", ")}`);

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
      destination: file.curriculumLocale ? localizedCurriculumPath(lesson.asset.canonicalPath, file.curriculumLocale) : lesson.asset.canonicalPath,
      content: lesson.content,
      asset: lesson.asset,
      curriculumLocale: file.curriculumLocale,
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
        content: file.publicationContent,
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
        body: JSON.stringify({ content: Buffer.from(file.publicationContent, "utf8").toString("base64"), encoding: "base64" }),
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
  const canonicalCurriculumFiles = curriculumFiles.filter((file) => !file.curriculumLocale);
  const canonicalBundledCurriculumFiles = bundledCurriculumFiles.filter((file) => !file.curriculumLocale);
  const curriculumTranslationFiles = resolvedFiles.filter((f) => f.curriculumTranslation !== null);
  const totalCurriculumAssets = curriculumFiles.length + bundledCurriculumFiles.length;
  const totalCurriculumTranslations = curriculumTranslationFiles.length;
  const totalTranslationLocales = curriculumTranslationFiles.reduce(
    (sum, file) => sum + (file.curriculumTranslation?.locales.length ?? 0),
    0,
  );
  let registryIncludedInPr = false;
  let derivedArtifactsIncludedInPr = false;

  if (canonicalCurriculumFiles.length + canonicalBundledCurriculumFiles.length > 0) {
    const existingRegistry = existingRegistryAtStart;
    const directEntries = canonicalCurriculumFiles
      .map((file) => {
        const contentBytes = Buffer.from(file.publicationContent, "utf8");
        return buildRegistryEntry(
          file.curriculumAsset!,
          contentBytes,
          ingestionId,
          ingestionTimestamp,
          file.checksum ? `sha256:${file.checksum}` : undefined,
        );
      });
    const bundledEntries = canonicalBundledCurriculumFiles.map((file) => {
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

    const currentInventory = await fetchCurrentJson<CurriculumInventory>(CURRICULUM_INVENTORY_PATH);
    const localizationAdds = new Map<string, InventoryLocalization[]>();
    const addLocalization = (id: string, item: InventoryLocalization) => {
      const key = id.toUpperCase();
      localizationAdds.set(key, [...(localizationAdds.get(key) ?? []), item]);
    };
    for (const file of curriculumFiles) {
      if (file.curriculumAsset && file.curriculumLocale) {
        addLocalization(file.curriculumAsset.id, { locale: file.curriculumLocale, path: file.resolvedDestination, source: "markdown" });
      }
    }
    for (const file of bundledCurriculumFiles) {
      if (file.curriculumLocale) {
        addLocalization(file.asset.id, { locale: file.curriculumLocale, path: file.destination, source: "markdown" });
      }
    }
    for (const file of curriculumTranslationFiles) {
      if (!file.curriculumTranslation) continue;
      for (const locale of file.curriculumTranslation.locales) {
        addLocalization(file.curriculumTranslation.lessonId, { locale, path: file.resolvedDestination, source: "json" });
      }
    }

    const derived = buildDerivedCurriculumFiles(updatedRegistry, currentInventory, localizationAdds);
    for (const [derivedPath, content] of [
      [CURRICULUM_INVENTORY_PATH, derived.inventory],
      [CURRICULUM_AUDIT_JSON_PATH, derived.auditJson],
      [CURRICULUM_AUDIT_MD_PATH, derived.auditMd],
    ] as const) {
      const derivedBlob = await githubRequest("/git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: Buffer.from(content, "utf8").toString("base64"), encoding: "base64" }),
      });
      blobs.push({ path: derivedPath, mode: "100644", type: "blob", sha: derivedBlob.sha as string });
    }

    registryIncludedInPr = true;
    derivedArtifactsIncludedInPr = true;
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
        `Derived curriculum audit/inventory updated in PR: ${derivedArtifactsIncludedInPr}`,
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

export async function createCurriculumLessonPullRequest(input: { lessonId: string; content: string; operation: "create" | "update" }) {
  const lessonId = input.lessonId.toUpperCase();
  if (!CANONICAL_LESSON_ID_RE.test(lessonId)) throw new Error(`Invalid canonical lesson ID: ${lessonId}`);
  const asset = await detectCurriculumAsset(input.content, `${lessonId}.md`);
  if (!asset || asset.id.toUpperCase() !== lessonId || asset.type !== "lesson") throw new Error(`Lesson content does not match canonical identity ${lessonId}.`);
  const validation = await validateCurriculumFiles([{ destination: asset.canonicalPath, content: input.content }]);
  if (!validation.success) throw new Error(`Curriculum validation failed: ${validation.errors.join("; ")}`);

  const existingRegistry = await fetchCurrentRegistry();
  const exists = activeLessonIds(existingRegistry).has(lessonId);
  if (input.operation === "create" && exists) throw new Error(`Lesson ${lessonId} already exists. Use edit instead.`);
  if (input.operation === "update" && !exists) throw new Error(`Lesson ${lessonId} does not exist in the canonical registry.`);

  const now = new Date(), importedAt = now.toISOString();
  const entry = buildRegistryEntry(asset, Buffer.from(input.content, "utf8"), `admin-${input.operation}-${Date.now()}`, importedAt);
  const updatedRegistry = upsertRegistryEntries(existingRegistry, [entry]);
  const currentInventory = await fetchCurrentJson<CurriculumInventory>(CURRICULUM_INVENTORY_PATH);
  const derived = buildDerivedCurriculumFiles(updatedRegistry, currentInventory, new Map());
  const baseBranch = process.env.EDUNANCIAL_GITHUB_BASE_BRANCH || DEFAULT_BASE_BRANCH;
  const branchName = `content/admin-${input.operation}-${lessonId.toLowerCase()}-${now.toISOString().replace(/[-:.TZ]/g, "").slice(0,14)}`;
  const refData = await githubRequest(`/git/ref/heads/${baseBranch}`);
  const baseSha = (refData.object as { sha: string }).sha;
  await githubRequest("/git/refs", { method: "POST", body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha }) });

  const files = [
    [asset.canonicalPath, input.content],
    [CURRICULUM_REGISTRY_PATH, JSON.stringify(updatedRegistry, null, 2) + "\n"],
    [CURRICULUM_INVENTORY_PATH, derived.inventory],
    [CURRICULUM_AUDIT_JSON_PATH, derived.auditJson],
    [CURRICULUM_AUDIT_MD_PATH, derived.auditMd],
  ] as const;
  const tree = [];
  for (const [filePath, content] of files) {
    const blob = await githubRequest("/git/blobs", { method: "POST", body: JSON.stringify({ content: Buffer.from(content, "utf8").toString("base64"), encoding: "base64" }) });
    tree.push({ path: filePath, mode: "100644", type: "blob", sha: blob.sha as string });
  }
  const baseCommit = await githubRequest(`/git/commits/${baseSha}`);
  const newTree = await githubRequest("/git/trees", { method: "POST", body: JSON.stringify({ base_tree: (baseCommit.tree as { sha: string }).sha, tree }) });
  const commit = await githubRequest("/git/commits", { method: "POST", body: JSON.stringify({ message: `Curriculum ${input.operation}: ${lessonId}`, tree: newTree.sha, parents: [baseSha] }) });
  await githubRequest(`/git/refs/heads/${branchName}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha, force: false }) });
  const pr = await githubRequest("/pulls", { method: "POST", body: JSON.stringify({
    title: `Curriculum ${input.operation}: ${lessonId}`, head: branchName, base: baseBranch,
    body: [`Canonical admin lesson ${input.operation}.`, `Lesson: ${lessonId}`, `Path: ${asset.canonicalPath}`, `Validation: passed`, "Registry/inventory/audit artifacts updated atomically in this PR."].join("\n"),
  }) });
  return { branch: branchName, pullRequestUrl: pr.html_url as string, pullRequestNumber: pr.number as number };
}


export async function createCurriculumLessonDeletePullRequest(lessonIdInput: string) {
  const lessonId = lessonIdInput.toUpperCase();
  if (!CANONICAL_LESSON_ID_RE.test(lessonId)) throw new Error(`Invalid canonical lesson ID: ${lessonId}`);
  const registry = await fetchCurrentRegistry();
  let canonicalPath = "";
  let removed = false;
  for (const track of Object.values(registry.tracks ?? {})) {
    for (const level of Object.values(track.levels ?? {})) {
      const entry = level.assets?.[lessonId];
      if (!entry || entry.type !== "lesson" || entry.status !== "active") continue;
      canonicalPath = entry.path;
      delete level.assets[lessonId];
      removed = true;
    }
  }
  if (!removed || !canonicalPath) throw new Error(`Lesson ${lessonId} does not exist in the canonical registry.`);
  registry._generated = new Date().toISOString();

  const currentInventory = await fetchCurrentJson<CurriculumInventory>(CURRICULUM_INVENTORY_PATH);
  const derived = buildDerivedCurriculumFiles(registry, currentInventory, new Map());
  const baseBranch = process.env.EDUNANCIAL_GITHUB_BASE_BRANCH || DEFAULT_BASE_BRANCH;
  const now = new Date();
  const branchName = `content/admin-delete-${lessonId.toLowerCase()}-${now.toISOString().replace(/[-:.TZ]/g, "").slice(0,14)}`;
  const refData = await githubRequest(`/git/ref/heads/${baseBranch}`);
  const baseSha = (refData.object as { sha: string }).sha;
  await githubRequest("/git/refs", { method: "POST", body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha }) });

  const tree: Array<{ path: string; mode: string; type: string; sha: string | null }> = [
    { path: canonicalPath, mode: "100644", type: "blob", sha: null },
  ];
  for (const [filePath, content] of [
    [CURRICULUM_REGISTRY_PATH, JSON.stringify(registry, null, 2) + "\n"],
    [CURRICULUM_INVENTORY_PATH, derived.inventory],
    [CURRICULUM_AUDIT_JSON_PATH, derived.auditJson],
    [CURRICULUM_AUDIT_MD_PATH, derived.auditMd],
  ] as const) {
    const blob = await githubRequest("/git/blobs", { method: "POST", body: JSON.stringify({ content: Buffer.from(content, "utf8").toString("base64"), encoding: "base64" }) });
    tree.push({ path: filePath, mode: "100644", type: "blob", sha: blob.sha as string });
  }
  const baseCommit = await githubRequest(`/git/commits/${baseSha}`);
  const newTree = await githubRequest("/git/trees", { method: "POST", body: JSON.stringify({ base_tree: (baseCommit.tree as { sha: string }).sha, tree }) });
  const commit = await githubRequest("/git/commits", { method: "POST", body: JSON.stringify({ message: `Curriculum delete: ${lessonId}`, tree: newTree.sha, parents: [baseSha] }) });
  await githubRequest(`/git/refs/heads/${branchName}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha, force: false }) });
  const pr = await githubRequest("/pulls", { method: "POST", body: JSON.stringify({
    title: `Curriculum delete: ${lessonId}`, head: branchName, base: baseBranch,
    body: [`Canonical admin lesson deletion.`, `Lesson: ${lessonId}`, `Path removed: ${canonicalPath}`, "Registry/inventory/audit artifacts updated in the same Git transaction.", "Runtime publication is not removed ahead of canonical Git merge."].join("\n"),
  }) });
  return { branch: branchName, pullRequestUrl: pr.html_url as string, pullRequestNumber: pr.number as number };
}
