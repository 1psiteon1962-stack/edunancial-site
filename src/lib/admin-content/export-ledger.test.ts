import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { CURRICULUM_EXPORT_LABEL, pullRequestNumberFromUrl } from "@/lib/admin-content/github";

test("Q4: export PR numbers are parsed from receipt URLs", () => {
  assert.equal(pullRequestNumberFromUrl("https://github.com/o/r/pull/1234"), 1234);
  assert.equal(pullRequestNumberFromUrl("https://github.com/o/r/pull/77/files"), 77);
  assert.equal(pullRequestNumberFromUrl("https://github.com/o/r/pull/77?x=1"), 77);
  assert.equal(pullRequestNumberFromUrl("https://github.com/o/r/issues/9"), null);
  assert.equal(pullRequestNumberFromUrl(null), null);
});

test("Q4: exporter label matches the auto-merge workflow label", async () => {
  const automerge = await import(join(process.cwd(), "scripts/curriculum/export-automerge.mjs"));
  assert.equal(automerge.EXPORT_LABEL, CURRICULUM_EXPORT_LABEL);
});

test("Q4: the receipt ledger only moves OPEN exports to MERGED", () => {
  const source = readFileSync(join(process.cwd(), "src/lib/admin-content/upload-receipts.ts"), "utf8");
  assert.match(source, /"NOT_REQUIRED"\|"PENDING"\|"OPEN"\|"MERGED"\|"CLOSED"\|"FAILED"/u);
  assert.match(source, /current&&current\.githubExport\.state==="OPEN"\?\{[^}]*state:"MERGED"/u);
});

test("Q4: ledger reconciliation reads newest receipts first and closes PRs closed without merge", () => {
  const source = readFileSync(join(process.cwd(), "src/lib/admin-content/upload-receipts.ts"), "utf8");
  assert.match(source, /listOpenGithubExportReceipts\(limit=50\)[\s\S]{0,400}\.sort\(\(a,b\)=>b\.updatedAt\.localeCompare\(a\.updatedAt\)\)/u, "newest first");
  assert.match(source, /current&&current\.githubExport\.state==="OPEN"\?\{[^}]*state:"CLOSED"/u, "only OPEN can become CLOSED");
  const route = readFileSync(join(process.cwd(), "src/app/api/admin/content/upload/github-export-next/route.ts"), "utf8");
  assert.match(route, /listOpenGithubExportReceipts\(50\)/u);
  assert.match(route, /else if\(status\.state==="closed"\)/u);
});
