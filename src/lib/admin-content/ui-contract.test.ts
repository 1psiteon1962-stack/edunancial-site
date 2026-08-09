import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";

function readSource(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("admin-content UI contract", () => {
  test("dashboard exposes visible batch selection and deletion controls", () => {
    const source = readSource("src/components/admin-content/ContentDashboardClient.tsx");
    assert.match(source, /Select All Visible/);
    assert.match(source, /Delete Selected Batches/);
    assert.match(source, /Clear Selection/);
    assert.match(source, /No content batches are currently stored\./);
    assert.match(source, /Upload Content/);
    assert.match(source, /Open batch/);
    assert.match(source, /Delete/);
  });

  test("batch review exposes visible file selection and empty batch behavior", () => {
    const source = readSource("src/components/admin-content/BatchReviewClient.tsx");
    assert.match(source, /Select All Visible/);
    assert.match(source, /Delete Selected Files/);
    assert.match(source, /Clear Selection/);
    assert.match(source, /Delete File/);
    assert.match(source, /This batch contains no files\./);
    assert.match(source, /Delete Empty Batch/);
  });

  test("maintenance page exposes required destructive action labels", () => {
    const source = readSource("src/components/admin-content/MaintenanceClient.tsx");
    assert.match(source, /Delete Failed Batches/);
    assert.match(source, /Scan for Orphans/);
    assert.match(source, /Delete Orphaned Objects/);
    assert.match(source, /Clear Content Workspace/);
  });
});
