import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { classifyDurablePaths, readDurableExportPage } from "@/lib/admin-content/durable-curriculum-export";

function fakeStorage(objects: Record<string, Buffer | null>) {
  return {
    async listWorkspaceEntries() { return Object.keys(objects); },
    async readBinary(path: string) { return objects[path] ?? null; },
  };
}

test("Q2 export: only durable curriculum is archived; uploads are inventory-only; scratch is ignored", () => {
  const { archive, inventory } = classifyDurablePaths([
    "published/atomic/a.json", "/receipts/r.json", "exports/e.json", "uploads/u.zip", "scratch/s", "tmp/t", "batches/b.json", "locks/l",
  ]);
  assert.deepEqual(archive, ["exports/e.json", "published/atomic/a.json", "receipts/r.json"]);
  assert.deepEqual(inventory, ["uploads/u.zip"]);
});

test("Q2 export: pages walk every object exactly once with matching checksums", async () => {
  const objects: Record<string, Buffer> = {};
  for (let i = 0; i < 7; i += 1) objects[`published/atomic/l${i}.json`] = Buffer.alloc(400, i);
  objects["uploads/big.zip"] = Buffer.alloc(10_000, 9);
  const storage = fakeStorage(objects);
  const seen: string[] = [];
  let cursor: number | null = 0;
  let pages = 0;
  while (cursor !== null) {
    const page = await readDurableExportPage(storage, { cursor, maxBytes: 1000, maxEntries: 3 });
    pages += 1;
    for (const entry of page.entries) {
      seen.push(entry.path);
      assert.equal(entry.sha256, createHash("sha256").update(objects[entry.path]).digest("hex"));
      if (entry.kind === "archive") assert.ok(Buffer.from(entry.contentBase64 ?? "", "base64").equals(objects[entry.path]));
      else assert.equal(entry.contentBase64, undefined, "uploads are never copied, only inventoried");
    }
    assert.deepEqual(page.totals, { archive: 7, inventory: 1, all: 8 });
    cursor = page.nextCursor;
  }
  assert.ok(pages > 2, "byte and entry limits split the export into several pages");
  assert.deepEqual(seen, [...Object.keys(objects)].sort((a, b) => (a.startsWith("uploads/") ? 1 : 0) - (b.startsWith("uploads/") ? 1 : 0) || a.localeCompare(b)));
});

test("Q2 export: unreadable and oversized objects are reported, never silently dropped", async () => {
  const storage = fakeStorage({ "published/gone.json": null, "published/huge.json": Buffer.alloc(5 * 1024 * 1024, 1) });
  const page = await readDurableExportPage(storage, {});
  assert.deepEqual(page.missing, ["published/gone.json"]);
  assert.equal(page.entries[0].path, "published/huge.json");
  assert.equal(page.entries[0].tooLarge, true);
  assert.equal(page.entries[0].contentBase64, undefined);
});

test("Q2 export route is read-only and accepts only the curriculum archive workflow identity", () => {
  const route = readFileSync(join(process.cwd(), "src/app/api/admin/curriculum/durable-export/route.ts"), "utf8");
  assert.match(route, /authorizeGithubActionsRun\(request, \["schedule", "workflow_dispatch"\], GITHUB_RUNNER_WORKFLOWS\.curriculumArchive\)/u);
  assert.doesNotMatch(route, /export async function (POST|PUT|PATCH|DELETE)/u);
  assert.doesNotMatch(route, /getAdminSession/u, "no browser-session path into the bulk export");
  const lib = readFileSync(join(process.cwd(), "src/lib/admin-content/durable-curriculum-export.ts"), "utf8");
  assert.doesNotMatch(lib, /saveBinary|deleteBinary|updateBinary|createIfAbsent|deleteIfVersion/u, "export never writes or deletes");
});
