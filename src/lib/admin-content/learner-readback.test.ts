import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { test } from "node:test";

import { expectedBodies, normalizeForComparison } from "@/lib/admin-content/learner-readback";
import type { ExtractedFile, UploadBatch } from "@/lib/admin-content/types";
import type { PackageIdentity } from "@/lib/admin-content/package-upload-config";
import { extractPublishedLessonsFromBatch } from "@/lib/curriculum/authoritative-published";

const LABEL_HEADER_LESSON = `Filename: BLUE-L4-001.md
Folder: /blue/level-4/
Title: Why Lenders Read Cash Flow Before Collateral
Meta Description: Learn why lenders weigh repayment capacity first.
SEO Keywords: cash flow, collateral, underwriting
Slug: blue-l4-001-cash-flow-before-collateral

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain why repayment capacity drives a lending decision
- Explain the role collateral plays as a secondary source of repayment

## Lesson
A lender's first question is whether the business can repay from operations.
`;

function file(id: string, name: string, raw: string): ExtractedFile {
  return {
    id, batchId: "batch_test", uploadId: "upload_test", originalFilename: name, normalizedFilename: name,
    archivePath: `blue/level-4/en_us/${name}`, sourceArchiveFilename: "BLUE-L4-lessons.zip", extension: ".md",
    mimeType: "text/markdown", sizeBytes: raw.length, checksum: "x", processingStatus: "processed",
    reviewStatus: "approved", conflictStatus: "none", duplicateStatus: "new", previewText: "", rawText: raw,
    encodedContent: Buffer.from(raw, "utf8").toString("base64"), classification: {}, metadata: {},
    warnings: [], error: null, approvedAt: null, rejectedAt: null, updatedAt: new Date().toISOString(),
  } as unknown as ExtractedFile;
}
function batch(files: ExtractedFile[]): UploadBatch {
  return { id: "batch_test", name: "t", slug: "t", source: "t", notes: "", status: "approved", createdAt: "", updatedAt: "",
    uploads: [{ id: "upload_test", originalFilename: "BLUE-L4-lessons.zip" }], files, auditHistory: [], exports: [], warnings: [] } as unknown as UploadBatch;
}
const IDENTITY = { track: "blue", level: "level-4", language: "en-US" } as PackageIdentity;

test("read-back expectation for a label-header lesson equals the body publication stores", async () => {
  const b = batch([file("f1", "BLUE-L4-001.md", LABEL_HEADER_LESSON)]);
  const expected = expectedBodies(b, IDENTITY).get("BLUE-L4-001");
  assert.ok(expected, "lesson must be extracted");
  assert.ok(!/Filename:|Meta Description:/u.test(expected!), "label header must not be part of the expected learner body");
  const [published] = await extractPublishedLessonsFromBatch(b);
  assert.equal(published?.id, "BLUE-L4-001");
  assert.equal(normalizeForComparison(published!.body), normalizeForComparison(expected!));
});

test("read-back still rejects genuinely different learner content (verification not weakened)", () => {
  const b = batch([file("f1", "BLUE-L4-001.md", LABEL_HEADER_LESSON)]);
  const expected = expectedBodies(b, IDENTITY).get("BLUE-L4-001")!;
  const stale = "## Learning Objectives\nAn older lesson body that a stale row would serve to the learner instead.";
  assert.notEqual(normalizeForComparison(stale), normalizeForComparison(expected));
});
