#!/usr/bin/env node
/**
 * Production curriculum auditor (client).
 *
 * Walks every TRACK × LEVEL × LOCALE coordinate through the deployed learner
 * resolver (/api/admin/curriculum/production-audit), then writes:
 *   - <out>/audit-matrix.txt      one line per coordinate (PASS / FAIL + missing ids)
 *   - <out>/level1-matrix.txt     L1 locale × track grid of retrievable counts
 *   - <out>/audit-full.json       per-lesson layer diagnostics (where each lesson disappears)
 *
 * Ratchet (durability guard): curriculum/verification/production-baseline.json
 * lists coordinates that have passed before. Any baseline coordinate that no
 * longer passes exits 1 — previously valid curriculum may never silently vanish.
 *   --update-baseline   ADD newly passing coordinates (never removes any).
 *
 * Auth (one of):
 *   EDUNANCIAL_ADMIN_COOKIE="edunancial_admin_session=..."   (copy from a logged-in admin browser)
 *   GitHub Actions: GITHUB_TOKEN + GITHUB_REPOSITORY + GITHUB_RUN_ID (workflow_dispatch / schedule on main)
 *
 * Usage:
 *   node scripts/curriculum/production-audit.mjs [--base https://edunancial.com] [--levels 1] [--locales en-US,fr-CA] [--tracks RED] [--out reports/production-audit] [--update-baseline]
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const TRACKS = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"];
const LEVELS = [1, 2, 3, 4, 5];
const BASELINE = "curriculum/verification/production-baseline.json";

function arg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 && process.argv[index + 1] && !process.argv[index + 1].startsWith("--") ? process.argv[index + 1] : fallback;
}
const flag = (name) => process.argv.includes(`--${name}`);
const list = (value) => (value ? String(value).split(",").map((x) => x.trim()).filter(Boolean) : null);

const base = arg("base", process.env.EDUNANCIAL_BASE_URL ?? "https://edunancial.com").replace(/\/+$/u, "");
const tracks = list(arg("tracks")) ?? TRACKS;
const levels = (list(arg("levels")) ?? LEVELS).map(Number);
const outDir = arg("out", "reports/production-audit");
const concurrency = Number(arg("concurrency", "4"));

function headers() {
  const h = { accept: "application/json" };
  if (process.env.EDUNANCIAL_ADMIN_COOKIE) h.cookie = process.env.EDUNANCIAL_ADMIN_COOKIE;
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_RUN_ID) {
    h.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    h["x-github-repository"] = process.env.GITHUB_REPOSITORY ?? "";
    h["x-github-run-id"] = process.env.GITHUB_RUN_ID;
  }
  return h;
}

async function call(query, attempt = 0) {
  const url = `${base}/api/admin/curriculum/production-audit?${new URLSearchParams(query)}`;
  const response = await fetch(url, { headers: headers() });
  if (response.status === 401) throw new Error("401 Unauthorized — set EDUNANCIAL_ADMIN_COOKIE or run from the GitHub workflow.");
  if (!response.ok) {
    if (attempt < 2) { await new Promise((r) => setTimeout(r, 2000 * (attempt + 1))); return call(query, attempt + 1); }
    throw new Error(`${response.status} for ${url}: ${(await response.text()).slice(0, 300)}`);
  }
  return response.json();
}

async function main() {
  // Discover the supported locale list from production itself (catalog-driven).
  let locales = list(arg("locales"));
  if (!locales) {
    const probe = await call({ tracks: "RED", levels: "1", locales: "en-US" });
    locales = probe.meta.supportedLocales ?? [];
    locales = ["en-US", ...locales.filter((l) => l !== "en-US")];
    if (locales.length < 2) throw new Error("Could not derive the locale catalog from production; pass --locales explicitly.");
  }

  const jobs = [];
  // Level 1 first: it is the launch-critical grid and must survive a cut-off run.
  for (const level of levels) for (const locale of locales) for (const track of tracks) jobs.push({ track, level, locale });
  const results = [];
  let meta = null;
  let cursor = 0;
  let failedCalls = 0;
  async function worker() {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      try {
        const response = await call({ tracks: job.track, levels: String(job.level), locales: job.locale });
        meta ??= response.meta;
        results.push(...response.coordinates);
        process.stderr.write(".");
      } catch (error) {
        failedCalls++;
        // An uncomputable coordinate is a defect, not "unknown": record it as FAIL with the reason.
        results.push({ ...job, expectedLessonCount: 50, discoveredLessonCount: 0, retrievableLessonCount: 0, englishFallbackLessonCount: 0, missingLessonIDs: [], englishFallbackLessonIDs: [], firstLessonRetrievable: false, lastLessonRetrievable: false, source: {}, runtimeStatus: "FAIL", failures: [], auditError: String(error.message ?? error) });
        process.stderr.write("x");
      }
    }
  }

  const report = (partial) => {
  const key = (r) => `${r.track}:L${r.level}:${r.locale}`;
  const order = (r) => [locales.indexOf(r.locale), r.level, TRACKS.indexOf(r.track)];
  results.sort((a, b) => { const x = order(a), y = order(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; });

  const line = (r) => {
    const head = `${r.track.padEnd(6)} L${r.level} ${r.locale.padEnd(13)} ${String(r.retrievableLessonCount).padStart(2)}/${r.expectedLessonCount} ${r.runtimeStatus}`;
    if (r.runtimeStatus === "PASS") return head;
    const bits = [];
    if (r.auditError) bits.push(`AUDIT ERROR: ${r.auditError}`);
    if (r.missingLessonIDs?.length) bits.push(`missing ${r.missingLessonIDs.length} [${r.missingLessonIDs.join(",")}]`);
    if (r.englishFallbackLessonIDs?.length) bits.push(`English fallback ${r.englishFallbackLessonIDs.length}`);
    const causes = [...new Set((r.failures ?? []).map((f) => f.disappearsAt))];
    if (causes.length) bits.push(`cause: ${causes.join(" | ")}`);
    return `${head} — ${bits.join("; ")}`;
  };

  const grid = [`${"".padEnd(14)}${TRACKS.map((t) => t.padStart(7)).join("")}`];
  for (const locale of locales) {
    grid.push(`${locale.padEnd(14)}${TRACKS.map((t) => {
      const r = results.find((x) => x.track === t && x.level === 1 && x.locale === locale);
      return String(r ? r.retrievableLessonCount : "ERR").padStart(7);
    }).join("")}`);
  }

  // Ratchet against the baseline.
  const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : { coordinates: [] };
  const passing = new Set(results.filter((r) => r.runtimeStatus === "PASS").map(key));
  const audited = new Set(results.map(key));
  const regressions = baseline.coordinates.filter((c) => audited.has(c) && !passing.has(c));

  mkdirSync(outDir, { recursive: true });
  const header = [
    `# Edunancial production curriculum audit`,
    `# base=${base} generated=${meta?.generatedAt ?? new Date().toISOString()} commit=${meta?.deployCommit ?? "unknown"} source=${meta?.curriculumSource ?? "unknown"}`,
    `# ${partial ? "PARTIAL RUN (cut off) — " : ""}coordinates=${results.length} PASS=${passing.size} FAIL=${results.length - passing.size} uncomputable=${failedCalls}`,
    `# baseline regressions=${regressions.length}${regressions.length ? ` [${regressions.join(", ")}]` : ""}`,
  ];
  writeFileSync(join(outDir, "audit-matrix.txt"), [...header, ...results.map(line)].join("\n") + "\n");
  writeFileSync(join(outDir, "level1-matrix.txt"), [`# Level 1 — production-retrievable lessons in the learner's own locale (0-50)`, ...grid].join("\n") + "\n");
  writeFileSync(join(outDir, "audit-full.json"), JSON.stringify({ meta, results }, null, 2));
  console.log([...header, "", ...grid].join("\n"));

    return { passing, regressions, baseline };
  };
  process.once("SIGTERM", () => { report(true); process.exit(3); });
  process.once("SIGINT", () => { report(true); process.exit(3); });
  await Promise.all(Array.from({ length: concurrency }, worker));
  process.stderr.write("\n");
  const { passing, regressions, baseline } = report(false);
  if (flag("update-baseline")) {
    const merged = [...new Set([...baseline.coordinates, ...passing])].sort();
    mkdirSync("curriculum/verification", { recursive: true });
    writeFileSync(BASELINE, JSON.stringify({ _note: "Ratchet: coordinates proven PASS in production. Only ever grows; removal requires curriculum-removals.json approval.", updatedAt: new Date().toISOString(), coordinates: merged }, null, 2) + "\n");
    console.log(`baseline: ${baseline.coordinates.length} -> ${merged.length} coordinates`);
  }
  if (regressions.length || failedCalls) process.exit(1);
}

main().catch((error) => { console.error(error); process.exit(2); });
