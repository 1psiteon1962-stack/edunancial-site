import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";

const LIVE = "118533057aa1ecfbfdd6a0a2ff25f4ce532ff2b9";
const OTHER = "f".repeat(40);

/** Minimal stand-in for the production audit endpoint: every coordinate fully passes. */
function fakeProduction(deployCommit) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const track = url.searchParams.get("tracks");
    const level = Number(url.searchParams.get("levels"));
    const locale = url.searchParams.get("locales");
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({
      meta: { generatedAt: new Date().toISOString(), deployCommit, curriculumSource: "test", supportedLocales: ["en-US"] },
      coordinates: [{
        track, level, locale, expectedLessonCount: 50, discoveredLessonCount: 50, retrievableLessonCount: 50,
        englishFallbackLessonCount: 0, missingLessonIDs: [], englishFallbackLessonIDs: [],
        firstLessonRetrievable: true, lastLessonRetrievable: true, runtimeStatus: "PASS", failures: [], source: { git: 50 },
      }],
    }));
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

function runAudit(port, expected) {
  const out = mkdtempSync(join(tmpdir(), "stale-deploy-"));
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["scripts/curriculum/production-audit.mjs", "--base", `http://127.0.0.1:${port}`, "--tracks", "RED", "--levels", "1", "--locales", "en-US", "--out", out], {
      env: { PATH: process.env.PATH, ...(expected === undefined ? {} : { EXPECTED_DEPLOY_SHA: expected }) },
    });
    let stderr = "";
    child.stderr.on("data", (d) => { stderr += d; });
    child.on("close", (status) => {
      let matrix = "";
      try { matrix = readFileSync(join(out, "audit-matrix.txt"), "utf8"); } catch { /* not written */ }
      resolve({ status, stderr, matrix });
    });
  });
}

test("audit passes when every response comes from the expected deployment", async () => {
  const server = await fakeProduction(LIVE);
  try {
    const result = await runAudit(server.address().port, LIVE);
    assert.equal(result.status, 0, result.stderr + result.matrix);
    assert.match(result.matrix, /RED +L1 en-US +50\/50 PASS/);
  } finally { server.close(); }
});

test("audit FAILS when production serves a different commit than the one being verified", async () => {
  const server = await fakeProduction(OTHER);
  try {
    const result = await runAudit(server.address().port, LIVE);
    assert.equal(result.status, 1, result.stderr + result.matrix);
    assert.match(result.matrix, /stale deployment: production served commit f{40}, expected 118533057/);
  } finally { server.close(); }
});

test("audit FAILS when production cannot state its commit (unknown is never accepted)", async () => {
  const server = await fakeProduction(null);
  try {
    const result = await runAudit(server.address().port, LIVE);
    assert.equal(result.status, 1, result.stderr + result.matrix);
    assert.match(result.matrix, /stale deployment: production served commit unknown/);
  } finally { server.close(); }
});

test("without an expected commit (schedule/dispatch runs) the guard is not applied", async () => {
  const server = await fakeProduction(OTHER);
  try {
    const result = await runAudit(server.address().port, undefined);
    assert.equal(result.status, 0, result.stderr + result.matrix);
  } finally { server.close(); }
});

test("malformed EXPECTED_DEPLOY_SHA is rejected before any request", async () => {
  const result = await runAudit(9, "1185330");
  assert.equal(result.status, 2);
  assert.match(result.stderr, /EXPECTED_DEPLOY_SHA must be a full 40-character commit SHA/);
});
