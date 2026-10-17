import assert from "node:assert/strict";
import test from "node:test";
import { isDurableCurriculumPath } from "@/lib/admin-content/deletion";

test("published curriculum and historical uploads cannot be cleanup orphans", () => {
  for (const key of [
    "published/atomic/lessons/RED-L3-001.json",
    "published/atomic/translation-packages/RED-L3-ht.json",
    "uploads/courses/legacy.zip",
    "receipts/upload.json",
    "locks/publishing",
    "jobs/recover.json",
    "exports/archive.zip",
    "index.json",
    "audit.json",
  ]) assert.equal(isDurableCurriculumPath(key), true, key);
});

test("unrelated scratch files are not classified as durable curriculum", () => {
  for (const key of ["scratch/temp.txt", "published-incomplete/record.json", "exports-old/file.zip"]) {
    assert.equal(isDurableCurriculumPath(key), false, key);
  }
});
