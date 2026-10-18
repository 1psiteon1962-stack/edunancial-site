import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";

import { __setGithubRequestTestAdapterForTests, createGithubPullRequest } from "@/lib/admin-content/github";
import { getAdminContentStorage, resetAdminContentStorage } from "@/lib/admin-content/storage";
import { createIndependentUploadBatchFromStoredFiles } from "@/lib/admin-content/stored-upload-finalizer";
import { autoPublishTrustedLocalizedLevel1Batch } from "@/lib/admin-content/trusted-localized-ingest";
import type { ExportPackage, UploadBatch } from "@/lib/admin-content/types";
import type { CourseUploadConfig } from "@/lib/admin-content/upload-intake";
import { getPublishedLesson, invalidateEffectiveCurriculumCache } from "@/lib/curriculum/authoritative-published";
import { invalidateAtomicPublishedCache } from "@/lib/curriculum/atomic-published-store";
import { invalidateTranslationPackageCache } from "@/lib/curriculum/translation-package-store";

// Q6 — end-to-end publication tests. Each test drives the real upload path:
// stored ZIP -> independent upload batch -> trusted localized publication
// (atomic Path A) -> learner resolver, against the local durable store.

const TRACK = "RED";
const LEVEL = 1;

function storeRoot(): string {
  return process.env.EDUNANCIAL_CONTENT_STORE_ROOT?.trim() || join(process.cwd(), ".admin-content-store");
}

function makeStoredZip(entries: Array<{ name: string; data: Buffer }>): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;
  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt32LE(entry.data.length, 18);
    local.writeUInt32LE(entry.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    localParts.push(local, name, entry.data);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt32LE(entry.data.length, 20);
    central.writeUInt32LE(entry.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);
    offset += local.length + name.length + entry.data.length;
  }
  const centralDirectory = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDirectory.length, 12);
  eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...localParts, centralDirectory, eocd]);
}

function lessonMarkdown(number: number, locale: string, marker: string): string {
  const n = String(number).padStart(3, "0");
  const id = `${TRACK}-L${LEVEL}-${n}`;
  return `---
id: ${id}
track: ${TRACK}
officialTrackName: Real Estate
level: ${LEVEL}
lessonNumber: ${number}
title: ${marker} ${n}
summary: ${marker} summary ${n}
version: 1.0
author: Edunancial Faculty
date: 2026-10-18
locale: ${locale}
---

## Learning Objectives

${marker} body for ${id} in ${locale}. This text proves the learner resolver returns the uploaded translation.
`;
}

function packageEntries(locale: string, marker: string, options: { omit?: number } = {}) {
  const entries: Array<{ name: string; data: Buffer }> = [];
  for (let number = 1; number <= 50; number += 1) {
    if (number === options.omit) continue;
    const id = `${TRACK}-L${LEVEL}-${String(number).padStart(3, "0")}`;
    entries.push({ name: `${id}.md`, data: Buffer.from(lessonMarkdown(number, locale, marker), "utf8") });
  }
  return entries;
}

function dropInMemoryCaches(): void {
  invalidateTranslationPackageCache();
  invalidateAtomicPublishedCache();
  invalidateEffectiveCurriculumCache();
}

async function uploadAndPublish(locale: string, marker: string, key: string, options: { omit?: number; zip?: Buffer } = {}) {
  const storage = getAdminContentStorage();
  const zip = options.zip ?? makeStoredZip(packageEntries(locale, marker, options));
  const storagePath = `incoming/q6-${key}.zip`;
  await storage.saveBinary(storagePath, zip, "application/zip");
  const config: CourseUploadConfig = {
    destination: "courses",
    track: "red",
    level: "level-1",
    language: locale,
    membershipAccess: "basic",
    publicationStatus: "published",
    title: `RED Level 1 ${locale}`,
    description: "Q6 end-to-end publication test",
  };
  const batch = await createIndependentUploadBatchFromStoredFiles(
    new Request("https://edunancial.com/api/admin/content/upload/finalize", { headers: { "x-forwarded-for": "127.0.0.1" } }),
    { email: "owner@edunancial.test" },
    {
      batchId: `batch_q6_${key}`,
      batchName: `Q6 ${key}`,
      source: "integration-test",
      notes: "",
      uploadConfig: config,
      uploads: [{ uploadId: `upload_q6_${key}`, originalFilename: `RED-L1-001-050-${locale}.zip`, mimeType: "application/zip", sizeBytes: zip.length, storagePath }],
    },
  );
  const result = await autoPublishTrustedLocalizedLevel1Batch(
    batch,
    { track: "red", level: "level-1", language: locale, title: `RED Level 1 ${locale}` },
    { requireAtomic: true },
  );
  return { batch, result, zip };
}

async function snapshot(locale: string, ids = [1, 25, 50]) {
  dropInMemoryCaches();
  const out: Record<string, { title: string; body: string } | null> = {};
  for (const number of ids) {
    const id = `${TRACK}-L${LEVEL}-${String(number).padStart(3, "0")}`;
    const lesson = await getPublishedLesson(id, locale);
    out[id] = lesson ? { title: lesson.title, body: lesson.body } : null;
  }
  return out;
}

function listFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root, { recursive: true }).map(String).filter((entry) => {
    try { return statSync(join(root, entry)).isFile(); } catch { return false; }
  }).sort();
}

beforeEach(() => {
  resetAdminContentStorage();
  dropInMemoryCaches();
});

afterEach(() => {
  __setGithubRequestTestAdapterForTests(null);
  resetAdminContentStorage();
  dropInMemoryCaches();
});

test("Q6.1: a translated ZIP publishes and the learner resolver returns its text for that locale", async () => {
  const { result } = await uploadAndPublish("pt-BR", "Q6 Portugues", "translated");
  assert.equal(result.attempted, true);
  assert.equal(result.translated, 50);
  const lessons = await snapshot("pt-BR", [1, 25, 50]);
  for (const [id, lesson] of Object.entries(lessons)) {
    assert.ok(lesson, `${id} must resolve for pt-BR`);
    assert.match(lesson.title, /^Q6 Portugues \d{3}$/u, `${id} title must be the uploaded translation`);
    assert.match(lesson.body, new RegExp(`Q6 Portugues body for ${id} in pt-BR`, "u"));
  }
});

test("Q6.2: a defective package is rejected and reported while a good package still publishes", async () => {
  const good = await uploadAndPublish("pt-BR", "Q6 Good", "good");
  assert.equal(good.result.translated, 50);

  await assert.rejects(
    () => uploadAndPublish("fr-CA", "Q6 Defective", "defective", { omit: 18 }),
    /failed validation|missing lesson 018/iu,
    "a package missing a lesson must fail loudly instead of publishing partially",
  );

  // Nothing from the defective package reached learners, and the good package is intact.
  const french = await snapshot("fr-CA", [1, 17, 19, 50]);
  for (const [id, lesson] of Object.entries(french)) {
    assert.doesNotMatch(lesson?.title ?? "", /Q6 Defective/u, `${id} must not expose a partially published package`);
  }
  const portuguese = await snapshot("pt-BR", [1, 18, 50]);
  for (const [id, lesson] of Object.entries(portuguese)) assert.match(lesson?.title ?? "", /^Q6 Good \d{3}$/u, id);
});

test("Q6.3: re-uploading the same ZIP creates no duplicates and changes nothing", async () => {
  const first = await uploadAndPublish("pt-BR", "Q6 Same", "first");
  const before = await snapshot("pt-BR", [1, 25, 50]);
  const english = await snapshot("en-US", [1, 25, 50]);

  let secondError: unknown = null;
  try {
    await uploadAndPublish("pt-BR", "Q6 Same", "second", { zip: first.zip });
  } catch (error) {
    // Rejecting an exact duplicate is acceptable; silently changing state is not.
    secondError = error;
  }

  assert.deepEqual(await snapshot("pt-BR", [1, 25, 50]), before, "a repeated upload must not change learner content");
  assert.deepEqual(await snapshot("en-US", [1, 25, 50]), english, "a repeated upload must not change canonical English");
  for (const lesson of Object.values(await snapshot("pt-BR", [1, 25, 50]))) {
    assert.equal((lesson?.body.match(/Q6 Same body for/gu) ?? []).length, 1, "translated body must not be duplicated");
  }
  assert.ok(secondError === null || secondError instanceof Error);
});

test("Q6.4: published translations survive a simulated redeploy (fresh caches, same durable store)", async () => {
  await uploadAndPublish("pt-BR", "Q6 Durable", "durable");
  const before = await snapshot("pt-BR", [1, 25, 50]);

  // Simulate a new deployment: keep the durable store bytes, discard every
  // in-process object and cache, then read back through a new storage instance.
  const root = storeRoot();
  const preserved = mkdtempSync(join(tmpdir(), "edunancial-q6-store-"));
  try {
    cpSync(root, preserved, { recursive: true });
    const filesBefore = listFiles(root);
    resetAdminContentStorage(); // drops the cached storage object and the directory
    dropInMemoryCaches();
    cpSync(preserved, root, { recursive: true });
    assert.deepEqual(listFiles(root), filesBefore, "durable store restored byte-for-byte");

    const after = await snapshot("pt-BR", [1, 25, 50]);
    assert.deepEqual(after, before);
    for (const lesson of Object.values(after)) assert.match(lesson?.title ?? "", /^Q6 Durable \d{3}$/u);
  } finally {
    rmSync(preserved, { recursive: true, force: true });
  }
});

test("Q6.5: publishing locale X never alters English or other locales of the same lessons", async () => {
  await uploadAndPublish("pt-BR", "Q6 Portugues", "locale-a");
  const englishBefore = await snapshot("en-US", [1, 25, 50]);
  const portugueseBefore = await snapshot("pt-BR", [1, 25, 50]);

  await uploadAndPublish("fr-CA", "Q6 Francais", "locale-b");

  assert.deepEqual(await snapshot("en-US", [1, 25, 50]), englishBefore, "canonical English unchanged");
  assert.deepEqual(await snapshot("pt-BR", [1, 25, 50]), portugueseBefore, "pt-BR unchanged by fr-CA publication");
  for (const lesson of Object.values(await snapshot("fr-CA", [1, 25, 50]))) assert.match(lesson?.title ?? "", /^Q6 Francais \d{3}$/u);
  for (const lesson of Object.values(englishBefore)) assert.doesNotMatch(lesson?.title ?? "", /Q6 /u, "English never shows a translation");
});

test("Q6.6: the export job builds a PR with translation files at canonical paths", async () => {
  const { batch } = await uploadAndPublish("pt-BR", "Q6 Export", "export");

  const saved = {
    token: process.env.EDUNANCIAL_GITHUB_TOKEN,
    owner: process.env.EDUNANCIAL_GITHUB_OWNER,
    repo: process.env.EDUNANCIAL_GITHUB_REPO,
    base: process.env.EDUNANCIAL_GITHUB_BASE_BRANCH,
  };
  process.env.EDUNANCIAL_GITHUB_TOKEN = "test-token";
  process.env.EDUNANCIAL_GITHUB_OWNER = "edunancial-test";
  process.env.EDUNANCIAL_GITHUB_REPO = "curriculum-test";
  process.env.EDUNANCIAL_GITHUB_BASE_BRANCH = "main";
  try {
    const registry = readFileSync(join(process.cwd(), "curriculum/registry.json"));
    const inventoryPath = join(process.cwd(), "curriculum/inventory.json");
    const inventory = existsSync(inventoryPath) ? readFileSync(inventoryPath) : Buffer.from(JSON.stringify({ assets: [] }));
    let committedTree: Array<{ path: string }> = [];
    const labels: string[] = [];
    let blob = 0;
    __setGithubRequestTestAdapterForTests(async (requestPath, init) => {
      const method = init.method ?? "GET";
      if (method === "GET" && requestPath === "/contents/curriculum/registry.json") return { content: registry.toString("base64") };
      if (method === "GET" && requestPath === "/contents/curriculum/inventory.json") return { content: inventory.toString("base64") };
      if (method === "GET" && requestPath.startsWith("/contents/")) throw new Error("GitHub API request failed (404): Not Found");
      if (method === "GET" && requestPath === "/git/ref/heads/main") return { object: { sha: "base-sha" } };
      if (method === "GET" && requestPath === "/git/commits/base-sha") return { tree: { sha: "base-tree" } };
      if (method === "POST" && requestPath === "/git/refs") return {};
      if (method === "POST" && requestPath === "/git/blobs") { blob += 1; return { sha: `blob-${blob}` }; }
      if (method === "POST" && requestPath === "/git/trees") {
        committedTree = (JSON.parse(String(init.body ?? "{}")) as { tree?: Array<{ path: string }> }).tree ?? [];
        return { sha: "tree" };
      }
      if (method === "POST" && requestPath === "/git/commits") return { sha: "commit" };
      if (method === "PATCH" && requestPath.startsWith("/git/refs/heads/")) return {};
      if (method === "POST" && requestPath === "/pulls") return { html_url: "https://github.test/pull/61", number: 61 };
      if (method === "POST" && requestPath === "/issues/61/labels") {
        labels.push(...((JSON.parse(String(init.body ?? "{}")) as { labels?: string[] }).labels ?? []));
        return {};
      }
      throw new Error(`Unexpected mocked GitHub request: ${method} ${requestPath}`);
    });

    const exportPackage: ExportPackage = {
      id: "export_q6",
      batchId: batch.id,
      fileName: "q6.zip",
      storagePath: "exports/q6.zip",
      manifestPath: "exports/q6/manifest.json",
      auditSummaryPath: "exports/q6/audit.json",
      warningsPath: "exports/q6/warnings.json",
      rejectedFilesPath: "exports/q6/rejected.json",
      createdAt: "2026-10-18T00:00:00.000Z",
      validation: { success: true, warnings: [], errors: [] },
    };
    const stored = (await getAdminContentStorage().getBatch(batch.id)) as UploadBatch | null;
    const result = await createGithubPullRequest(stored ?? batch, exportPackage);
    assert.equal(result.pullRequestNumber, 61);

    const translationPaths = committedTree.map((entry) => entry.path).filter((path) => /\.pt-BR\.md$/u.test(path)).sort();
    assert.equal(translationPaths.length, 50, "all 50 translations are exported");
    for (const path of translationPaths) {
      assert.match(path, /^content\/curriculum\/RED\/L1\/RED-L1-\d{3}\.pt-BR\.md$/u, `canonical path: ${path}`);
    }
    // The canonical English files are never overwritten by a translation export.
    assert.equal(committedTree.filter((entry) => /^content\/curriculum\/RED\/L1\/RED-L1-\d{3}\.md$/u.test(entry.path)).length, 0);
  } finally {
    for (const [key, value] of Object.entries({ EDUNANCIAL_GITHUB_TOKEN: saved.token, EDUNANCIAL_GITHUB_OWNER: saved.owner, EDUNANCIAL_GITHUB_REPO: saved.repo, EDUNANCIAL_GITHUB_BASE_BRANCH: saved.base })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
