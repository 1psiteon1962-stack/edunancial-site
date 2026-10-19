import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { receiptMatchesBatch, summarizePublicationStatus } from "@/lib/admin-content/publication-status";
import type { UploadReceipt } from "@/lib/admin-content/upload-receipts";

function receipt(overrides: Partial<UploadReceipt> = {}): UploadReceipt {
  return {
    uploadId: "upload_1", originalBatchId: "batch_orig", storagePath: "uploads/upload_1-x.zip", originalFilename: "RED-L1.zip", coordinate: "red:level-1:pt-BR",
    state: "PUBLISHED", attempts: 1, startedAt: null, publishedAt: "2026-10-18T00:00:00Z", updatedAt: "2026-10-18T00:00:00Z",
    reviewBatchId: "batch_review", retryable: false, lastError: null, recoveredWithoutReupload: false,
    verification: { learnerVisible: true, detail: "50/50" },
    githubExport: { state: "PENDING", attempts: 0, branch: null, pullRequestUrl: null, lastError: null },
    ...overrides,
  };
}

test("Q5: Live only after learner read-back verification", () => {
  assert.equal(summarizePublicationStatus(receipt()).live, true);
  assert.equal(summarizePublicationStatus(receipt({ verification: { learnerVisible: false, detail: "0/50" } })).live, false);
  assert.equal(summarizePublicationStatus(receipt({ verification: null })).live, false);
  assert.equal(summarizePublicationStatus(receipt({ state: "STORED_FOR_REVIEW" })).live, false);
  assert.equal(summarizePublicationStatus(null).live, false);
});

test("Q5: In Git only after the export pull request merged", () => {
  const merged = receipt({ githubExport: { state: "MERGED", attempts: 1, branch: "content/course-upload-x", pullRequestUrl: "https://github.com/o/r/pull/9", lastError: null, mergeCommitSha: "abc", mergedAt: "2026-10-18T01:00:00Z" } });
  assert.equal(summarizePublicationStatus(merged).inGit, true);
  assert.equal(summarizePublicationStatus(merged).label, "Live · In Git");
  for (const state of ["NOT_REQUIRED", "PENDING", "OPEN", "FAILED"] as const) {
    assert.equal(summarizePublicationStatus(receipt({ githubExport: { state, attempts: 1, branch: null, pullRequestUrl: null, lastError: null } })).inGit, false, state);
  }
  assert.equal(summarizePublicationStatus(receipt({ githubExport: { state: "OPEN", attempts: 1, branch: "b", pullRequestUrl: "https://github.com/o/r/pull/9", lastError: null } })).label, "Live · Git export PR open");
});

test("Q5: a receipt belongs to a review batch only when it points back to it", () => {
  assert.equal(receiptMatchesBatch(receipt(), "batch_review"), true);
  assert.equal(receiptMatchesBatch(receipt(), "batch_other"), false);
  assert.equal(receiptMatchesBatch(null, "batch_review"), false);
});

test("Q5: the batch screen reads learner verification from the status summary", () => {
  const client = readFileSync(join(process.cwd(), "src/components/admin-content/BatchReviewClient.tsx"), "utf8");
  assert.match(client, /const recoveryPublished = publicationStatus\?\.live === true;/u);
  assert.doesNotMatch(client, /publicationReceipt\?\.learnerVisible/u, "learnerVisible lives under verification, never at the receipt top level");
  assert.match(client, /"Live"/u);
  assert.match(client, /"In Git"/u);
});
