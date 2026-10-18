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
 *   GitHub Actions: signed OIDC identity token (workflow needs `permissions: id-token: write`),
 *   requested fresh every few minutes and sent only to the production origin.
 *
 * Usage:
 *   node scripts/curriculum/production-audit.mjs [--base https://edunancial.com] [--levels 1] [--locales en-US,fr-CA] [--tracks RED] [--out reports/production-audit] [--update-baseline]
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { validateCoordinateResponse } from "./audit-response-validation.mjs";
import { AUDIT_TRACKS, AUDIT_USAGE, AuditArgsError, parseAuditArgs } from "./production-audit-args.mjs";

const BASELINE = "curriculum/verification/production-baseline.json";
const TRACKS = AUDIT_TRACKS;

// Parse strictly before ANY network call: unknown, duplicated, valueless or
// "--name=value" options exit 2 instead of silently changing the audit scope.
let options;
try {
  options = parseAuditArgs(process.argv.slice(2), process.env);
} catch (error) {
  if (!(error instanceof AuditArgsError)) throw error;
  console.error(error.message);
  console.error(AUDIT_USAGE);
  process.exit(2);
}
const { base, tracks, levels, out: outDir, concurrency } = options;

// Stale-deploy guard: when the workflow knows which commit must be live (push runs),
// every response must come from exactly that deployment. A deploy that changes or
// rolls back mid-run turns the affected coordinates into FAIL instead of passing
// on code that was never the commit being verified.
const EXPECTED_DEPLOY_SHA = process.env.EXPECTED_DEPLOY_SHA?.trim().toLowerCase() || null;
if (EXPECTED_DEPLOY_SHA && !/^[0-9a-f]{40}$/.test(EXPECTED_DEPLOY_SHA)) {
  console.error("Invalid arguments: EXPECTED_DEPLOY_SHA must be a full 40-character commit SHA.");
  process.exit(2);
}
function assertExpectedDeployment(response) {
  if (!EXPECTED_DEPLOY_SHA) return;
  const served = response?.meta?.deployCommit ?? null;
  if (served !== EXPECTED_DEPLOY_SHA) {
    throw new Error(`stale deployment: production served commit ${served ?? "unknown"}, expected ${EXPECTED_DEPLOY_SHA}`);
  }
}

// GitHub Actions OIDC: credentials go ONLY to the production origin, and a fresh
// short-lived token is requested well before expiry so multi-hour audits keep working.
const OIDC_AUDIENCE = process.env.EDUNANCIAL_GITHUB_OIDC_AUDIENCE || "https://edunancial.com/api/admin";
const OIDC_REFRESH_MS = 4 * 60_000;
const TRUSTED_ORIGINS = new Set(["https://edunancial.com", "https://www.edunancial.com"]);
let oidcCache = null;

async function githubOidcToken() {
  const requestUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  const requestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if (!requestUrl || !requestToken) return null;
  if (oidcCache && Date.now() - oidcCache.at < OIDC_REFRESH_MS) return oidcCache.value;
  const url = new URL(requestUrl);
  url.searchParams.set("audience", OIDC_AUDIENCE);
  const response = await fetch(url, { headers: { authorization: `Bearer ${requestToken}`, accept: "application/json" }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`GitHub OIDC token request failed (HTTP ${response.status}); the workflow needs "permissions: id-token: write".`);
  const { value } = await response.json();
  if (typeof value !== "string" || value.split(".").length !== 3) throw new Error("GitHub OIDC token response was malformed.");
  oidcCache = { at: Date.now(), value };
  return value;
}

async function headers() {
  const h = { accept: "application/json" };
  if (process.env.EDUNANCIAL_ADMIN_COOKIE) h.cookie = process.env.EDUNANCIAL_ADMIN_COOKIE;
  if (TRUSTED_ORIGINS.has(new URL(base).origin)) {
    const token = await githubOidcToken();
    if (token) {
      h.authorization = `Bearer ${token}`;
      if (process.env.GITHUB_RUN_ID) h["x-github-run-id"] = process.env.GITHUB_RUN_ID;
    }
  }
  return h;
}

async function call(query, attempt = 0) {
  const url = `${base}/api/admin/curriculum/production-audit?${new URLSearchParams(query)}`;
  // Bound the client request to avoid indefinitely hanging CI audit workers.
  // A timed-out coordinate is already recorded as FAIL by the caller.
  const response = await fetch(url, { headers: await headers(), signal: AbortSignal.timeout(45_000) });
  if (response.status === 401) throw new Error("401 Unauthorized — set EDUNANCIAL_ADMIN_COOKIE or run from the GitHub workflow (with id-token: write).");
  if (!response.ok) {
    // Retrying 30-second gateway timeouts multiplies storage load without fixing them.
    // Keep retries for transient 429/503 responses only; every failed coordinate remains FAIL.
    if ((response.status === 429 || response.status === 503) && attempt < 2) { await new Promise((r) => setTimeout(r, 2000 * (attempt + 1))); return call(query, attempt + 1); }
    throw new Error(`${response.status} for ${url}: ${(await response.text()).slice(0, 300)}`);
  }
  return response.json();
}

// GitHub keeps step annotations in the public check-run API even when logs and
// artifacts are unavailable to a reviewer. Publish the per-level matrix there so
// the audit outcome is inspectable without downloading anything. Output only:
// this never changes which coordinates pass or fail.
function annotationText(lines) {
  return lines.join("\n").replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}
function emitActionsAnnotations(header, results, locales) {
  const auditedLevels = [...new Set(results.map((r) => r.level))].sort((a, b) => a - b);
  for (const level of auditedLevels) {
    const rows = [`${"".padEnd(14)}${TRACKS.map((t) => t.padStart(7)).join("")}`];
    for (const locale of locales) {
      rows.push(`${locale.padEnd(14)}${TRACKS.map((t) => {
        const r = results.find((x) => x.track === t && x.level === level && x.locale === locale);
        if (!r) return "-".padStart(7);
        const mark = r.runtimeStatus === "PASS" ? "" : r.auditError ? "E" : r.englishFallbackLessonIDs?.length ? "f" : "x";
        return `${r.retrievableLessonCount}${mark}`.padStart(7);
      }).join("")}`);
    }
    console.log(`::notice title=Level ${level} learner-retrievable lessons (x=FAIL f=English fallback E=error)::${annotationText(rows)}`);
  }
  const errors = [...new Set(results.filter((r) => r.auditError).map((r) => r.auditError))].slice(0, 5);
  console.log(`::notice title=Audit summary::${annotationText([...header, ...errors.map((e) => `error: ${e}`)])}`);
}

async function main() {
  // Discover the supported locale list from production itself (catalog-driven).
  let locales = options.locales;
  if (!locales) {
    const probe = await call({ tracks: "RED", levels: "1", locales: "en-US" });
    assertExpectedDeployment(probe);
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
        const coordinate = validateCoordinateResponse(response, job);
        assertExpectedDeployment(response);
        meta ??= response.meta;
        results.push(coordinate);
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
  if (process.env.GITHUB_ACTIONS === "true") emitActionsAnnotations(header, results, locales);

    return { passing, regressions, baseline };
  };
  process.once("SIGTERM", () => { report(true); process.exit(3); });
  process.once("SIGINT", () => { report(true); process.exit(3); });
  await Promise.all(Array.from({ length: concurrency }, worker));
  process.stderr.write("\n");
  const { passing, regressions, baseline } = report(false);
  if (options.updateBaseline) {
    const merged = [...new Set([...baseline.coordinates, ...passing])].sort();
    mkdirSync("curriculum/verification", { recursive: true });
    writeFileSync(BASELINE, JSON.stringify({ _note: "Ratchet: coordinates proven PASS in production. Only ever grows; removal requires curriculum-removals.json approval.", updatedAt: new Date().toISOString(), coordinates: merged }, null, 2) + "\n");
    console.log(`baseline: ${baseline.coordinates.length} -> ${merged.length} coordinates`);
  }
  // An absent baseline must never turn FAIL coordinates (or an empty audit) into a green run.
  // Preserve complete diagnostics and artifacts above before signaling failure.
  if (regressions.length || failedCalls || results.length === 0 || results.some((entry) => entry.runtimeStatus !== "PASS")) process.exit(1);
}

main().catch((error) => { console.error(error); process.exit(2); });
