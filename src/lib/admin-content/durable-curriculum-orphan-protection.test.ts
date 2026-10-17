import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { deleteWorkspaceOrphans, isDurableCurriculumPath, scanWorkspaceOrphans } from "@/lib/admin-content/deletion";
import { getAdminContentStorage, resetAdminContentStorage } from "@/lib/admin-content/storage";

const DURABLE = [
  "published/atomic/lessons/RED-L3-001.json",
  "published/atomic/lesson-index.json",
  "published/atomic/batches/batch_abc.json",
  "published/atomic/translation-packages/RED-L3-en-GB.json",
  "published/curriculum-state.json",
  "published/curriculum-translation-index.json",
  "receipts/up_1.json",
  "uploads/courses/batch_x/upload_y-red-l3-001-050-ht.zip",
  "locks/curriculum-publication.json",
  "jobs/recovery/job_1.json",
  "exports/export_1.zip",
  "index.json",
  "audit.json",
];
const body = (path: string) => Buffer.from(path === "index.json" || path === "audit.json" ? "[]" : "{\"keep\":true}");
const actor = { userId: "test", email: "owner@example.test", role: "owner" } as never;

async function withStore(fn: () => Promise<void>) {
  const root = mkdtempSync(join(tmpdir(), "edunancial-orphans-"));
  const previous = process.env.EDUNANCIAL_CONTENT_STORE_ROOT;
  process.env.EDUNANCIAL_CONTENT_STORE_ROOT = root;
  resetAdminContentStorage();
  try { await fn(); }
  finally {
    resetAdminContentStorage();
    if (previous === undefined) delete process.env.EDUNANCIAL_CONTENT_STORE_ROOT; else process.env.EDUNANCIAL_CONTENT_STORE_ROOT = previous;
    rmSync(root, { recursive: true, force: true });
  }
}
test("orphan scan never lists durable curriculum, receipts, uploads or locks", () => withStore(async () => {
  const storage = getAdminContentStorage();
  for (const path of [...DURABLE, "scratch/tmp-leftover.bin"]) await storage.saveBinary(path, path.startsWith("scratch/") ? Buffer.from("x") : body(path), "application/json");
  const scan = await scanWorkspaceOrphans();
  for (const path of DURABLE) assert.ok(!scan.orphanPaths.includes(path), path + " must not be an orphan");
  assert.deepEqual(scan.orphanPaths, ["scratch/tmp-leftover.bin"]);
}));
test("delete-orphans refuses durable paths even when explicitly supplied", () => withStore(async () => {
  const storage = getAdminContentStorage();
  for (const path of DURABLE) await storage.saveBinary(path, body(path), "application/json");
  await storage.saveBinary("scratch/tmp-leftover.bin", Buffer.from("x"), "application/octet-stream");
  await deleteWorkspaceOrphans([...DURABLE, "scratch/tmp-leftover.bin"], actor);
  for (const path of DURABLE) assert.ok(await storage.readBinary(path), path + " must survive");
  assert.equal(await storage.readBinary("scratch/tmp-leftover.bin"), null);
}));
test("durable path classifier", () => {
  for (const path of DURABLE) assert.equal(isDurableCurriculumPath(path), true, path);
  assert.equal(isDurableCurriculumPath("/published/atomic/lessons/X.json"), true);
  assert.equal(isDurableCurriculumPath("scratch/tmp.bin"), false);
  assert.equal(isDurableCurriculumPath("publishedX/thing"), false);
});
