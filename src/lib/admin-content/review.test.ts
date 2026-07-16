import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { deriveBatchStatus } from "@/lib/admin-content/review";
import type { ExtractedFile } from "@/lib/admin-content/types";

function makeFile(overrides: Partial<ExtractedFile> = {}): ExtractedFile {
  return {
    id: "file-1",
    batchId: "batch-1",
    uploadId: "upload-1",
    originalFilename: "lesson.md",
    normalizedFilename: "lesson.md",
    archivePath: null,
    sourceArchiveFilename: null,
    extension: ".md",
    mimeType: "text/markdown",
    sizeBytes: 1,
    checksum: "sha256:test",
    processingStatus: "classified",
    reviewStatus: "pending",
    conflictStatus: "none",
    duplicateStatus: "new",
    previewText: "preview",
    rawText: "raw",
    encodedContent: Buffer.from("raw").toString("base64"),
    classification: { category: "lessons", subcategory: "general", language: "en", academyLevel: "level-1", destination: "content/curriculum/RED/L1/lesson.md", confidence: 0.9, reasons: [], pillar: "red" },
    metadata: { language: "en", region: null, title: "Lesson", description: "", source: "upload", intendedDestination: "content/curriculum/RED/L1/lesson.md", contentType: "lessons", pillar: "red", academyLevel: "level-1", publicationStatus: "draft", version: "1.0.0", checksum: "sha256:test", uploadBatchId: "batch-1" },
    warnings: [],
    error: null,
    approvedAt: null,
    rejectedAt: null,
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("admin-content review status", () => {
  test("derives partial review state", () => {
    assert.equal(deriveBatchStatus([makeFile({ reviewStatus: "approved" }), makeFile({ id: "file-2" })]), "partially-reviewed");
  });

  test("derives approved and rejected terminal states", () => {
    assert.equal(deriveBatchStatus([makeFile({ reviewStatus: "approved" })]), "approved");
    assert.equal(deriveBatchStatus([makeFile({ reviewStatus: "rejected" })]), "rejected");
  });
});
