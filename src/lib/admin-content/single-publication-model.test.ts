import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

// Q5 — one publication model. Every admin route that publishes uploaded
// translations must use the atomic translation-package path (Path A).
// The legacy per-record import path (Path B) stays available only as a read /
// explicit-import path and must not be reached from upload publication.

function routeFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...routeFiles(full));
    else if (name === "route.ts") out.push(full);
  }
  return out;
}

const appApi = join(process.cwd(), "src/app/api");

test("Q5: manual batch publication uses the atomic translation-package path", () => {
  const route = readFileSync(join(appApi, "admin/content/batches/[batchId]/publish/route.ts"), "utf8");
  assert.match(route, /repairAndPublishLocalizedBatch\(result\.batch, \{ requireAtomic: true \}\)/u);
});

test("Q5: no API route calls repairAndPublishLocalizedBatch without requireAtomic: true", () => {
  const offenders: string[] = [];
  for (const file of routeFiles(appApi)) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/repairAndPublishLocalizedBatch\(([^)]*)\)/gu)) {
      if (!/requireAtomic:\s*true/u.test(match[1])) offenders.push(`${file}: ${match[0]}`);
    }
  }
  assert.deepEqual(offenders, [], "every upload publication route must use Path A");
});
