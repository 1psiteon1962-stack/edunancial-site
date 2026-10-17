import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { runSequentialFinalization, shouldReconcileAmbiguousFinalizeError } from "@/lib/admin-content/finalize-queue";
import { getAdminContentStorage, resetAdminContentStorage } from "@/lib/admin-content/storage";
import {
  beginFinalization,
  FINALIZING_CLAIM_STALE_MS,
  FinalizationInProgressError,
  getUploadReceipt,
  markFailed,
} from "@/lib/admin-content/upload-receipts";

/**
 * Q3 regression gate: an automatic retry after an ambiguous HTTP 500/502/503
 * must never start a second, overlapping publication of the same upload.
 */

function withLocalStore(fn: () => Promise<void>) {
  return async () => {
    const root = mkdtempSync(join(tmpdir(), "edunancial-receipts-"));
    const previous = process.env.EDUNANCIAL_CONTENT_STORE_ROOT;
    process.env.EDUNANCIAL_CONTENT_STORE_ROOT = root;
    resetAdminContentStorage();
    try { await fn(); }
    finally {
      resetAdminContentStorage();
      if (previous === undefined) delete process.env.EDUNANCIAL_CONTENT_STORE_ROOT; else process.env.EDUNANCIAL_CONTENT_STORE_ROOT = previous;
      rmSync(root, { recursive: true, force: true });
    }
  };
}

const identity = (uploadId: string) => ({ uploadId, originalBatchId: "batch_orig", storagePath: `uploads/${uploadId}.zip`, originalFilename: "red-l3-pt-br.zip", coordinate: "RED:3:pt-BR" });

test("a second claim while the first is FINALIZING is refused and changes nothing", withLocalStore(async () => {
  const first = await beginFinalization(identity("up_1"), "batch_first", "finalize");
  assert.equal(first?.state, "FINALIZING");
  await assert.rejects(beginFinalization(identity("up_1"), "batch_second", "finalize"), FinalizationInProgressError);
  await assert.rejects(beginFinalization(identity("up_1"), "batch_recovery", "recovery"), FinalizationInProgressError, "recovery must not overlap a live finalize either");
  const receipt = await getUploadReceipt("up_1");
  assert.equal(receipt?.reviewBatchId, "batch_first", "the live attempt keeps ownership");
  assert.equal(receipt?.attempts, 1);
}));

test("concurrent claims for one upload: exactly one wins", withLocalStore(async () => {
  const outcomes = await Promise.allSettled([1, 2, 3, 4].map((n) => beginFinalization(identity("up_2"), `batch_${n}`, "finalize")));
  assert.equal(outcomes.filter((o) => o.status === "fulfilled").length, 1);
  assert.ok(outcomes.filter((o) => o.status === "rejected").every((o) => (o as PromiseRejectedResult).reason instanceof FinalizationInProgressError));
}));

test("an abandoned FINALIZING claim becomes reclaimable so uploads are never stranded", withLocalStore(async () => {
  await beginFinalization(identity("up_3"), "batch_crashed", "finalize");
  const storage = getAdminContentStorage();
  const path = "receipts/up_3.json";
  const stale = JSON.parse((await storage.readBinary(path))!.toString("utf8"));
  stale.startedAt = new Date(Date.now() - FINALIZING_CLAIM_STALE_MS - 1_000).toISOString();
  await storage.saveBinary(path, Buffer.from(JSON.stringify(stale)), "application/json");
  const retried = await beginFinalization(identity("up_3"), "batch_retry", "recovery");
  assert.equal(retried?.reviewBatchId, "batch_retry");
  assert.equal(retried?.attempts, 2);
}));

test("a FAILED attempt can be retried immediately", withLocalStore(async () => {
  await beginFinalization(identity("up_4"), "batch_a", "finalize");
  await markFailed("up_4", "HTTP 503 upstream", true);
  const retried = await beginFinalization(identity("up_4"), "batch_b", "finalize");
  assert.equal(retried?.state, "FINALIZING");
  assert.equal(retried?.reviewBatchId, "batch_b");
}));

test("a PUBLISHED receipt is returned untouched (idempotent retry)", withLocalStore(async () => {
  const storage = getAdminContentStorage();
  const published = { ...identity("up_5"), state: "PUBLISHED", attempts: 1, startedAt: new Date().toISOString(), publishedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), reviewBatchId: "batch_done", retryable: false, lastError: null, recoveredWithoutReupload: false, verification: { learnerVisible: true, detail: "ok" }, githubExport: { state: "NOT_REQUIRED", attempts: 0, branch: null, pullRequestUrl: null, lastError: null } };
  await storage.saveBinary("receipts/up_5.json", Buffer.from(JSON.stringify(published)), "application/json");
  const again = await beginFinalization(identity("up_5"), "batch_should_not_replace", "finalize");
  assert.equal(again?.state, "PUBLISHED");
  assert.equal(again?.reviewBatchId, "batch_done");
}));

test("uploader never re-POSTs on HTTP 409 (in progress); 503 is still retried", async () => {
  let calls409 = 0;
  const failures: unknown[] = [];
  await assert.rejects(runSequentialFinalization(["pkg"], async () => { calls409 += 1; throw new Error("pkg failed during finalization (HTTP 409): already being finalized"); }, undefined, ({ error }) => failures.push(error)), /HTTP 409/u);
  assert.equal(calls409, 1, "409 must go to status reconciliation, not an automatic re-POST");
  assert.equal(shouldReconcileAmbiguousFinalizeError(new Error("pkg failed during finalization (HTTP 409): in progress")), true, "the uploader must poll status for a 409, not report a failure");
  assert.equal(failures.length, 1);

  let calls503 = 0;
  const results = await runSequentialFinalization(["pkg"], async () => { calls503 += 1; if (calls503 === 1) throw new Error("HTTP 503"); return "ok"; });
  assert.deepEqual(results, ["ok"]);
  assert.equal(calls503, 2);
});
