import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// Protected floor (owner decision 2026-10-18): coordinates on the floor must keep
// passing; coordinates not yet on the floor are reported, not treated as outages.

const script = resolve("scripts/curriculum/production-audit.mjs");
const COMMIT = "a".repeat(40);

function passing(track, level, locale) {
  return { track, level, locale, expectedLessonCount: 50, discoveredLessonCount: 50, retrievableLessonCount: 50,
    englishFallbackLessonCount: 0, missingLessonIDs: [], englishFallbackLessonIDs: [],
    firstLessonRetrievable: true, lastLessonRetrievable: true, runtimeStatus: "PASS", failures: [], source: { git: 50 } };
}

function englishFallback(track, level, locale) {
  const ids = Array.from({ length: 50 }, (_, i) => `${track}-L${level}-${String(i + 1).padStart(3, "0")}`);
  const layers = { gitCanonical: true, gitLocaleFile: false, atomicObject: false, atomicObjectHasLocale: false,
    atomicIndexed: false, translationPackage: false, discovered: true, retrieved: true, servedLocale: "en", servedSource: null };
  return { track, level, locale, expectedLessonCount: 50, discoveredLessonCount: 50, retrievableLessonCount: 0,
    englishFallbackLessonCount: 50, missingLessonIDs: [], englishFallbackLessonIDs: ids,
    firstLessonRetrievable: false, lastLessonRetrievable: false, runtimeStatus: "FAIL",
    failures: ids.map((lessonId) => ({ lessonId, disappearsAt: "no localized source", layers })), source: {} };
}

/** RED passes everywhere; WHITE is English fallback (content not yet written). */
function fakeProduction() {
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const track = url.searchParams.get("tracks");
    const level = Number(url.searchParams.get("levels"));
    const locale = url.searchParams.get("locales");
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({
      meta: { generatedAt: new Date().toISOString(), deployCommit: COMMIT, curriculumSource: "test", supportedLocales: ["en-US", "de"] },
      coordinates: [track === "RED" ? passing(track, level, locale) : englishFallback(track, level, locale)],
    }));
  });
  return new Promise((done) => server.listen(0, "127.0.0.1", () => done(server)));
}

function runAudit(port, floor) {
  const cwd = mkdtempSync(join(tmpdir(), "audit-floor-"));
  if (floor) {
    mkdirSync(join(cwd, "curriculum/verification"), { recursive: true });
    writeFileSync(join(cwd, "curriculum/verification/production-baseline.json"), JSON.stringify({ coordinates: floor }));
  }
  const out = join(cwd, "report");
  return new Promise((done) => {
    const child = spawn(process.execPath, [script, "--base", `http://127.0.0.1:${port}`, "--tracks", "RED,WHITE", "--levels", "1", "--locales", "en-US,de", "--out", out],
      { cwd, env: { PATH: process.env.PATH } });
    let stderr = "";
    child.stderr.on("data", (d) => { stderr += d; });
    child.on("close", (status) => {
      const read = (name) => { try { return readFileSync(join(out, name), "utf8"); } catch { return ""; } };
      const proposedPath = join(out, "proposed-baseline.json");
      const proposed = existsSync(proposedPath) ? JSON.parse(readFileSync(proposedPath, "utf8")).coordinates : null;
      const result = { status, stderr, matrix: read("audit-matrix.txt"), notYet: read("not-yet-available.txt"), proposed };
      rmSync(cwd, { recursive: true, force: true });
      done(result);
    });
  });
}

test("floor: content not yet written is reported but does not fail the audit", async () => {
  const server = await fakeProduction();
  try {
    const result = await runAudit(server.address().port, ["RED:L1:en-US", "RED:L1:de"]);
    assert.equal(result.status, 0, result.stderr + result.matrix);
    assert.match(result.matrix, /protected floor=2 newly passing=0 not yet available=2/);
    assert.match(result.notYet, /WHITE:L1:de/);
    assert.match(result.notYet, /WHITE:L1:en-US/);
    assert.equal(result.proposed, null, "nothing new passed, so no floor raise is proposed");
  } finally { server.close(); }
});

test("floor: a floor coordinate that stops passing fails the audit", async () => {
  const server = await fakeProduction();
  try {
    const result = await runAudit(server.address().port, ["RED:L1:en-US", "WHITE:L1:de"]);
    assert.equal(result.status, 1, result.stderr + result.matrix);
    assert.match(result.matrix, /baseline regressions=1 \[WHITE:L1:de\]/);
  } finally { server.close(); }
});

test("floor: an absent floor never turns FAIL coordinates into a green run", async () => {
  const server = await fakeProduction();
  try {
    const result = await runAudit(server.address().port, null);
    assert.equal(result.status, 1, result.stderr + result.matrix);
  } finally { server.close(); }
});

test("floor: newly passing coordinates produce a raised floor that only grows", async () => {
  const server = await fakeProduction();
  try {
    const result = await runAudit(server.address().port, ["RED:L1:en-US"]);
    assert.equal(result.status, 0, result.stderr + result.matrix);
    assert.match(result.matrix, /newly passing=1/);
    assert.deepEqual(result.proposed, ["RED:L1:de", "RED:L1:en-US"]);
  } finally { server.close(); }
});
