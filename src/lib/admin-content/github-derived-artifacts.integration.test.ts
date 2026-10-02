import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import {
  __setGithubRequestTestAdapterForTests,
  createGithubPullRequest,
} from "@/lib/admin-content/github";
import { resetAdminContentStorage } from "@/lib/admin-content/storage";
import type { ExtractedFile, ExportPackage, UploadBatch } from "@/lib/admin-content/types";

const ORIGINAL_GITHUB_ENV = {
  token: process.env.EDUNANCIAL_GITHUB_TOKEN,
  owner: process.env.EDUNANCIAL_GITHUB_OWNER,
  repo: process.env.EDUNANCIAL_GITHUB_REPO,
  base: process.env.EDUNANCIAL_GITHUB_BASE_BRANCH,
};

function lessonFile(index: number, batchId: string): ExtractedFile {
  const number = String(index).padStart(3, "0");
  const id = `RED-L1-${number}`;
  const destination = `content/curriculum/RED/L1/${id}.md`;
  const body = `---
id: ${id}
track: RED
officialTrackName: Real Estate
level: 1
lessonNumber: ${index}
title: Publication proof ${number}
summary: Publication proof summary ${number}
version: 1.0
author: Edunancial Faculty
date: 2026-10-02
locale: en-US
---

## Learning Objectives

Publication proof content for ${id}.

## Core Content

This lesson exists to verify the trusted fifty-lesson GitHub publication tree and derived curriculum artifacts.
`;

  return {
    id: `file_${number}`,
    batchId,
    uploadId: "upload_50",
    originalFilename: `${id}.md`,
    normalizedFilename: `${id}.md`,
    archivePath: `${id}.md`,
    sourceArchiveFilename: "RED-L1-FULL-50-Lessons.zip",
    extension: ".md",
    mimeType: "text/markdown",
    sizeBytes: Buffer.byteLength(body),
    checksum: "",
    processingStatus: "classified",
    reviewStatus: "approved",
    conflictStatus: "none",
    duplicateStatus: "new",
    previewText: body.slice(0, 500),
    rawText: body,
    encodedContent: Buffer.from(body, "utf8").toString("base64"),
    classification: {
      category: "courses",
      subcategory: "level-1",
      language: "en-US",
      academyLevel: "level-1",
      destination,
      confidence: 1,
      reasons: ["trusted canonical curriculum package"],
      pillar: "red",
    },
    metadata: {
      language: "en-US",
      region: "US",
      title: `Publication proof ${number}`,
      description: `Publication proof summary ${number}`,
      source: "integration-test",
      intendedDestination: destination,
      contentType: "courses",
      pillar: "red",
      academyLevel: "level-1",
      publicationStatus: "published",
      version: "1.0",
      checksum: "",
      uploadBatchId: batchId,
    },
    warnings: [],
    error: null,
    approvedAt: "2026-10-02T00:00:00.000Z",
    rejectedAt: null,
    updatedAt: "2026-10-02T00:00:00.000Z",
  };
}

afterEach(() => {
  __setGithubRequestTestAdapterForTests(null);
  resetAdminContentStorage();
  if (ORIGINAL_GITHUB_ENV.token === undefined) delete process.env.EDUNANCIAL_GITHUB_TOKEN;
  else process.env.EDUNANCIAL_GITHUB_TOKEN = ORIGINAL_GITHUB_ENV.token;
  if (ORIGINAL_GITHUB_ENV.owner === undefined) delete process.env.EDUNANCIAL_GITHUB_OWNER;
  else process.env.EDUNANCIAL_GITHUB_OWNER = ORIGINAL_GITHUB_ENV.owner;
  if (ORIGINAL_GITHUB_ENV.repo === undefined) delete process.env.EDUNANCIAL_GITHUB_REPO;
  else process.env.EDUNANCIAL_GITHUB_REPO = ORIGINAL_GITHUB_ENV.repo;
  if (ORIGINAL_GITHUB_ENV.base === undefined) delete process.env.EDUNANCIAL_GITHUB_BASE_BRANCH;
  else process.env.EDUNANCIAL_GITHUB_BASE_BRANCH = ORIGINAL_GITHUB_ENV.base;
});

test("50-lesson GitHub publication commits registry inventory and both audit artifacts together", async () => {
  process.env.EDUNANCIAL_GITHUB_TOKEN = "test-token";
  process.env.EDUNANCIAL_GITHUB_OWNER = "edunancial-test";
  process.env.EDUNANCIAL_GITHUB_REPO = "curriculum-test";
  process.env.EDUNANCIAL_GITHUB_BASE_BRANCH = "main";

  const batchId = "batch_50_derived_artifacts";
  const batch: UploadBatch = {
    id: batchId,
    name: "RED L1 full 50 publication proof",
    slug: "red-l1-full-50-publication-proof",
    source: "stored-zip-recovery",
    notes: "Proves synchronized GitHub-derived artifacts.",
    status: "approved",
    createdAt: "2026-10-02T00:00:00.000Z",
    updatedAt: "2026-10-02T00:00:00.000Z",
    uploads: [],
    files: Array.from({ length: 50 }, (_, index) => lessonFile(index + 1, batchId)),
    auditHistory: [],
    exports: [],
    warnings: [],
  };
  const exportPackage: ExportPackage = {
    id: "export_50",
    batchId,
    fileName: "red-l1-full-50.zip",
    storagePath: "exports/red-l1-full-50.zip",
    manifestPath: "exports/red-l1-full-50/manifest.json",
    auditSummaryPath: "exports/red-l1-full-50/audit.json",
    warningsPath: "exports/red-l1-full-50/warnings.json",
    rejectedFilesPath: "exports/red-l1-full-50/rejected.json",
    createdAt: "2026-10-02T00:00:00.000Z",
    validation: { success: true, warnings: [], errors: [] },
  };

  let blobSequence = 0;
  let committedTree: Array<{ path: string; mode: string; type: string; sha: string }> = [];
  __setGithubRequestTestAdapterForTests(async (requestPath, init) => {
    const method = init.method ?? "GET";
    if (method === "GET" && requestPath === "/contents/curriculum/registry.json") {
      return {
        content: Buffer.from(JSON.stringify({
          _schema: "curriculum/schemas/registry.schema.json",
          _version: "1.0",
          _generated: "2026-10-02T00:00:00.000Z",
          _note: "test registry",
          tracks: {},
        })).toString("base64"),
      };
    }
    if (method === "GET" && requestPath === "/contents/curriculum/inventory.json") {
      return { content: Buffer.from(JSON.stringify({ assets: [] })).toString("base64") };
    }
    if (method === "GET" && requestPath === "/git/ref/heads/main") {
      return { object: { sha: "base-sha" } };
    }
    if (method === "POST" && requestPath === "/git/refs") return {};
    if (method === "POST" && requestPath === "/git/blobs") {
      blobSequence += 1;
      return { sha: `blob-${blobSequence}` };
    }
    if (method === "GET" && requestPath === "/git/commits/base-sha") {
      return { tree: { sha: "base-tree" } };
    }
    if (method === "POST" && requestPath === "/git/trees") {
      const payload = JSON.parse(String(init.body ?? "{}")) as { tree?: typeof committedTree };
      committedTree = payload.tree ?? [];
      return { sha: "publication-tree" };
    }
    if (method === "POST" && requestPath === "/git/commits") return { sha: "publication-commit" };
    if (method === "PATCH" && requestPath.startsWith("/git/refs/heads/")) return {};
    if (method === "POST" && requestPath === "/pulls") {
      return { html_url: "https://github.test/pull/50", number: 50 };
    }
    throw new Error(`Unexpected mocked GitHub request: ${method} ${requestPath}`);
  });

  const result = await createGithubPullRequest(batch, exportPackage);
  assert.equal(result.pullRequestNumber, 50);

  const paths = new Set(committedTree.map((entry) => entry.path));
  assert.equal(
    [...paths].filter((path) => /^content\/curriculum\/RED\/L1\/RED-L1-\d{3}\.md$/u.test(path)).length,
    50,
  );
  for (const requiredPath of [
    "curriculum/registry.json",
    "curriculum/inventory.json",
    "curriculum/reports/CURRICULUM-AUDIT.json",
    "curriculum/reports/CURRICULUM-AUDIT.md",
    exportPackage.manifestPath,
  ]) {
    assert.ok(paths.has(requiredPath), `GitHub publication tree missing ${requiredPath}`);
  }
});
