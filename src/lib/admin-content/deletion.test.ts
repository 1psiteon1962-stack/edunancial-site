import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";

import {
  getPublishedTracks,
  upsertPublishedLessonsFromBatch,
} from "@/lib/curriculum/authoritative-published";
import {
  bulkDeleteBatchFiles,
  clearWorkspace,
  deleteBatch,
  deleteBatchFile,
  deleteWorkspaceOrphans,
  getWorkspaceMaintenanceStats,
  scanWorkspaceOrphans,
} from "@/lib/admin-content/deletion";
import { bulkReview, createUploadBatch, exportBatch, getUploadBatch } from "@/lib/admin-content/service";
import { getAdminContentStorage, resetAdminContentStorage } from "@/lib/admin-content/storage";

afterEach(() => {
  resetAdminContentStorage();
});

function makeRequest() {
  return new Request("https://example.com/api/admin/content/upload", {
    method: "POST",
    headers: { origin: "https://example.com", host: "example.com" },
  });
}

function makeFormData() {
  const formData = new FormData();
  formData.set("batchName", "Delete test batch");
  formData.set("source", "tests");
  formData.set("notes", "delete tests");
  formData.set("contentDestination", "courses");
  formData.set("courseTrack", "red");
  formData.set("courseLevel", "level-1");
  formData.set("language", "en");
  formData.set("membershipAccess", "basic");
  formData.set("publicationStatus", "draft");
  formData.set("title", "Delete tests");
  formData.set("description", "Delete tests");
  return formData;
}

describe("admin-content deletion service", () => {
  test("deletes a single file and recalculates batch state", async () => {
    const formData = makeFormData();
    formData.append("files", new File([Buffer.from("lesson one")], "lesson-one.md", { type: "text/markdown" }));
    formData.append("files", new File([Buffer.from("lesson two")], "lesson-two.md", { type: "text/markdown" }));
    const batch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);
    const storage = getAdminContentStorage();

    const targetFile = batch.files[0];
    const result = await deleteBatchFile(batch.id, targetFile.id, { email: "owner@example.com" });

    const updated = await getUploadBatch(batch.id);
    assert(updated);
    assert.equal(updated.files.length, 1);
    assert.equal(updated.files.some((entry) => entry.id === targetFile.id), false);
    assert.equal(result.remainingCounts.batches, 1);
    assert.equal(await storage.readBinary(batch.uploads[0]!.storagePath), null);
  });

  test("requires explicit exported-batch confirmation before deletion", async () => {
    const formData = makeFormData();
    formData.append("files", new File([Buffer.from("lesson")], "lesson.md", { type: "text/markdown" }));
    const batch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);
    await bulkReview(batch.id, { email: "owner@example.com" }, batch.files.map((entry) => entry.id), "approved");
    await exportBatch(batch.id, { email: "owner@example.com" });

    await assert.rejects(() => deleteBatch(batch.id, { email: "owner@example.com" }), /Explicit exported-batch confirmation/);

    const deleted = await deleteBatch(batch.id, { email: "owner@example.com" }, { allowExported: true });
    assert.equal(deleted.batchId, batch.id);

    const missing = await getUploadBatch(batch.id);
    assert.equal(missing, null);
  });

  test("detects and deletes orphan workspace objects", async () => {
    const formData = makeFormData();
    formData.append("files", new File([Buffer.from("lesson")], "lesson.md", { type: "text/markdown" }));
    await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);

    const storage = getAdminContentStorage();
    await storage.saveBinary("tmp/orphan.bin", Buffer.from("orphan"), "application/octet-stream");

    const scan = await scanWorkspaceOrphans({ email: "owner@example.com" });
    assert.equal(scan.orphanPaths.includes("tmp/orphan.bin"), true);

    const result = await deleteWorkspaceOrphans(["tmp/orphan.bin"], { email: "owner@example.com" });
    assert.equal(result.deleted, 1);

    const followup = await scanWorkspaceOrphans();
    assert.equal(followup.orphanPaths.includes("tmp/orphan.bin"), false);
  });

  test("rejects path traversal during orphan deletion", async () => {
    await assert.rejects(
      () => deleteWorkspaceOrphans(["../evil"], { email: "owner@example.com" }),
      /Unsafe workspace path/,
    );
  });

  test("bulk file deletion handles missing IDs safely", async () => {
    const formData = makeFormData();
    formData.append("files", new File([Buffer.from("lesson")], "lesson.md", { type: "text/markdown" }));
    const batch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);

    const result = await bulkDeleteBatchFiles(batch.id, [batch.files[0].id, "file_00000000-0000-0000-0000-000000000000"], { email: "owner@example.com" });
    assert.equal(result.deleted, 1);
    assert.equal(result.failures.length, 1);
    assert.equal(result.partial, true);
  });

  test("bulk file deletion persists all visible removals and leaves an empty batch when all files are deleted", async () => {
    const formData = makeFormData();
    formData.append("files", new File([Buffer.from("lesson one")], "lesson-one.md", { type: "text/markdown" }));
    formData.append("files", new File([Buffer.from("lesson two")], "lesson-two.md", { type: "text/markdown" }));
    const batch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);
    const storage = getAdminContentStorage();

    const result = await bulkDeleteBatchFiles(batch.id, batch.files.map((file) => file.id), { email: "owner@example.com" });

    const reloaded = await getUploadBatch(batch.id);
    assert(reloaded);
    assert.equal(result.deleted, 2);
    assert.equal(reloaded.files.length, 0);
    assert.equal(reloaded.uploads.length, 0);
    assert.equal(reloaded.status, "failed");
    assert.equal(result.remainingCounts.files, 0);
    assert.equal(await storage.readBinary(batch.uploads[0]!.storagePath), null);
  });

  test("clear workspace requires typed confirmation and leaves clean zero state", async () => {
    const formData = makeFormData();
    formData.append("files", new File([Buffer.from("lesson")], "lesson.md", { type: "text/markdown" }));
    await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);

    await assert.rejects(
      () => clearWorkspace({ email: "owner@example.com" }, "WRONG"),
      /confirmation text does not match/,
    );

    await clearWorkspace({ email: "owner@example.com" }, "DELETE ALL WORKSPACE CONTENT");
    const stats = await getWorkspaceMaintenanceStats();
    assert.equal(stats.totalBatches, 0);
    assert.equal(stats.totalFiles, 0);
    assert.equal(stats.pendingFiles, 0);
    assert.equal(stats.approvedFiles, 0);
    assert.equal(stats.conflicts, 0);
  });

  test("deleting a batch also removes its published curriculum from the public source", async () => {
    const formData = makeFormData();
    formData.append(
      "files",
      new File(
        [
          Buffer.from(`---\nid: RED-L1-901\ntrack: RED\nofficialTrackName: Real Estate\nlevel: 1\nlessonNumber: 901\ntitle: Delete Me\nversion: 1.0\nauthor: Test\ndate: 2026-01-01\nsummary: Temporary lesson\n---\n\n# Delete Me\n\nBody`),
        ],
        "delete-me.md",
        { type: "text/markdown" },
      ),
    );
    const batch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, formData);
    await bulkReview(batch.id, { email: "owner@example.com" }, batch.files.map((entry) => entry.id), "approved");
    const approvedBatch = await getUploadBatch(batch.id);
    assert(approvedBatch);

    const published = await upsertPublishedLessonsFromBatch(approvedBatch);
    assert.equal(published.upserted, 1);

    const beforeDelete = await getPublishedTracks("en");
    assert.equal(beforeDelete.some((track) => track.code === "RED" && track.lessonCount > 0), true);

    await deleteBatch(batch.id, { email: "owner@example.com" });

    const afterDelete = await getPublishedTracks("en");
    const redTrack = afterDelete.find((track) => track.code === "RED");
    assert.equal(redTrack?.levels.some((level) => level.lessons.some((lesson) => lesson.id === "RED-L1-901")) ?? false, false);
    const afterDeleteReload = await getPublishedTracks("en");
    assert.equal(afterDeleteReload.some((track) => track.levels.some((level) => level.lessons.some((lesson) => lesson.id === "RED-L1-901"))), false);

    const secondForm = makeFormData();
    secondForm.append(
      "files",
      new File(
        [
          Buffer.from(`---\nid: RED-L1-902\ntrack: RED\nofficialTrackName: Real Estate\nlevel: 1\nlessonNumber: 902\ntitle: Replacement Lesson\nversion: 1.0\nauthor: Test\ndate: 2026-01-01\nsummary: Replacement\n---\n\n# Replacement`),
        ],
        "replacement.md",
        { type: "text/markdown" },
      ),
    );
    const secondBatch = await createUploadBatch(makeRequest(), { email: "owner@example.com" }, secondForm);
    await bulkReview(secondBatch.id, { email: "owner@example.com" }, secondBatch.files.map((entry) => entry.id), "approved");
    const approvedSecond = await getUploadBatch(secondBatch.id);
    assert(approvedSecond);
    await upsertPublishedLessonsFromBatch(approvedSecond);

    const afterRepublish = await getPublishedTracks("en");
    assert.equal(afterRepublish.some((track) => track.levels.some((level) => level.lessons.some((lesson) => lesson.id === "RED-L1-901"))), false);
    assert.equal(afterRepublish.some((track) => track.levels.some((level) => level.lessons.some((lesson) => lesson.id === "RED-L1-902"))), true);
  });
});
