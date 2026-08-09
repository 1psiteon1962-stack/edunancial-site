import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { getVisibleSelectionState, pruneSelection, replaceVisibleSelection, summarizeSelectedBatches, summarizeSelectedFiles, toggleSelectionItem } from "@/lib/admin-content/selection";
import type { BatchSummary, ExtractedFile } from "@/lib/admin-content/types";

function makeBatch(overrides: Partial<BatchSummary>): BatchSummary {
  return {
    id: "batch_00000000-0000-0000-0000-000000000001",
    name: "Batch",
    slug: "batch",
    source: "tests",
    status: "ready-for-review",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    totalUploads: 1,
    totalFiles: 1,
    approvedFiles: 0,
    rejectedFiles: 0,
    pendingFiles: 1,
    conflicts: 0,
    ...overrides,
  };
}

function makeFile(overrides: Partial<ExtractedFile>): ExtractedFile {
  return {
    id: "file_00000000-0000-0000-0000-000000000001",
    batchId: "batch_00000000-0000-0000-0000-000000000001",
    uploadId: "upload_00000000-0000-0000-0000-000000000001",
    originalFilename: "lesson.md",
    normalizedFilename: "lesson.md",
    archivePath: null,
    sourceArchiveFilename: null,
    extension: ".md",
    mimeType: "text/markdown",
    sizeBytes: 10,
    checksum: "checksum",
    processingStatus: "classified",
    reviewStatus: "pending",
    conflictStatus: "none",
    duplicateStatus: "new",
    previewText: "preview",
    rawText: "raw",
    encodedContent: Buffer.from("raw").toString("base64"),
    classification: {
      category: "courses",
      subcategory: null,
      language: "en",
      academyLevel: "level-1",
      destination: "content/courses/red/level-1/en/lesson.md",
      confidence: 1,
      reasons: [],
      pillar: "red",
    },
    metadata: {
      language: "en",
      region: null,
      title: "lesson",
      description: "",
      source: "tests",
      intendedDestination: "content/courses/red/level-1/en/lesson.md",
      contentType: "courses",
      pillar: "red",
      academyLevel: "level-1",
      publicationStatus: "draft",
      version: "1.0.0",
      checksum: "checksum",
      uploadBatchId: "batch_00000000-0000-0000-0000-000000000001",
    },
    warnings: [],
    error: null,
    approvedAt: null,
    rejectedAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("admin-content selection helpers", () => {
  test("select all visible only affects visible ids and supports deselection", () => {
    const selected = replaceVisibleSelection(["batch-hidden"], ["batch-a", "batch-b"], true);
    assert.deepEqual(selected.sort(), ["batch-a", "batch-b", "batch-hidden"]);

    const cleared = replaceVisibleSelection(selected, ["batch-a", "batch-b"], false);
    assert.deepEqual(cleared, ["batch-hidden"]);
  });

  test("visible selection state supports indeterminate checkbox behavior", () => {
    const state = getVisibleSelectionState(["file-a"], ["file-a", "file-b"]);
    assert.equal(state.allVisibleSelected, false);
    assert.equal(state.someVisibleSelected, true);
    assert.equal(state.selectedVisible, 1);
  });

  test("prune selection removes deleted or filtered ids after refresh", () => {
    assert.deepEqual(pruneSelection(["file-a", "file-b"], ["file-b", "file-c"]), ["file-b"]);
  });

  test("toggleSelectionItem supports individual deselection after select all", () => {
    const selected = toggleSelectionItem(["file-a", "file-b"], "file-a", false);
    assert.deepEqual(selected, ["file-b"]);
  });

  test("summarizes selected batches for bulk delete confirmations", () => {
    const summary = summarizeSelectedBatches([
      makeBatch({ id: "batch_1", totalFiles: 3, status: "exported", conflicts: 1 }),
      makeBatch({ id: "batch_2", totalFiles: 2, status: "failed", conflicts: 2 }),
    ]);
    assert.deepEqual(summary, {
      batchCount: 2,
      totalFiles: 5,
      exportedBatches: 1,
      failedBatches: 1,
      conflicts: 3,
    });
  });

  test("summarizes selected files for bulk delete confirmations", () => {
    const summary = summarizeSelectedFiles([
      makeFile({ id: "file_1", reviewStatus: "approved" }),
      makeFile({ id: "file_2", reviewStatus: "pending", conflictStatus: "revision" }),
      makeFile({ id: "file_3", reviewStatus: "rejected" }),
    ]);
    assert.deepEqual(summary, {
      fileCount: 3,
      approvedFiles: 1,
      pendingFiles: 1,
      rejectedFiles: 1,
      conflicts: 1,
    });
  });
});
