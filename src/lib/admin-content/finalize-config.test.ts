import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

test("admin upload finalization keeps an extended server window", () => {
  const route = readFileSync(join(process.cwd(), "src/app/api/admin/content/upload/finalize/route.ts"), "utf8");
  assert.match(route, /export const runtime = "nodejs"/);
  assert.match(route, /export const dynamic = "force-dynamic"/);
  assert.match(route, /export const maxDuration = 300/);
  assert.match(route, /uploadReachedStorage: Boolean\(batchId\)/);
  assert.match(route, /retryable: Boolean\(batchId\)/);
});
