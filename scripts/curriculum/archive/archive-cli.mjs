#!/usr/bin/env node
// Q2 — encrypted curriculum archive CLI. See archive-lib.mjs for the security model.
//
//   node scripts/curriculum/archive/archive-cli.mjs export --out <dir>
//   node scripts/curriculum/archive/archive-cli.mjs verify --archive <dir>
//   node scripts/curriculum/archive/archive-cli.mjs restore-drill --archive <dir> --to <empty dir>
//
// Production reads use the read-only endpoint /api/admin/curriculum/durable-export,
// authorized only by this workflow's signed GitHub OIDC identity.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  BUNDLE_FILE, HMAC_FILE, buildBundle, bundleHmac, compareWithProduction, hmacEquals, openBundle,
  resolveKey, restoreBundle, sealBundle, sha256, verifyBundle,
} from "./archive-lib.mjs";

const BASE = process.env.CURRICULUM_ARCHIVE_BASE_URL?.trim() || "https://edunancial.com";
const TRUSTED_ORIGINS = new Set(["https://edunancial.com", "https://www.edunancial.com"]);
const OIDC_AUDIENCE = "https://edunancial.com/api/admin";
const OIDC_REFRESH_MS = 2 * 60_000;
const MAX_PAGES = 5000;
let oidc = null;

function arg(name) {
  const index = process.argv.indexOf(`--${name}`);
  const value = index > 0 ? process.argv[index + 1] : undefined;
  if (!value || value.startsWith("--")) throw new Error(`--${name} <value> is required`);
  return value;
}

async function oidcToken() {
  const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  const token = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if (!url || !token) throw new Error("GitHub OIDC is unavailable; the job needs permissions: id-token: write.");
  if (oidc && Date.now() - oidc.at < OIDC_REFRESH_MS) return oidc.value;
  const request = new URL(url);
  request.searchParams.set("audience", OIDC_AUDIENCE);
  const response = await fetch(request, { headers: { authorization: `Bearer ${token}`, accept: "application/json" }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`GitHub OIDC token request failed (HTTP ${response.status}).`);
  const { value } = await response.json();
  oidc = { at: Date.now(), value };
  return value;
}

async function fetchPage(cursor, content, attempt = 0) {
  const url = new URL("/api/admin/curriculum/durable-export", BASE);
  url.searchParams.set("cursor", String(cursor));
  url.searchParams.set("content", content ? "1" : "0");
  const headers = { accept: "application/json" };
  if (TRUSTED_ORIGINS.has(url.origin)) {
    headers.authorization = `Bearer ${await oidcToken()}`;
    if (process.env.GITHUB_RUN_ID) headers["x-github-run-id"] = process.env.GITHUB_RUN_ID;
  }
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(60_000) });
  if (response.status === 401 && attempt === 0 && oidc) { oidc = null; return fetchPage(cursor, content, 1); }
  if ((response.status === 429 || response.status === 502 || response.status === 503 || response.status === 504) && attempt < 3) {
    await new Promise((resolve) => setTimeout(resolve, 3000 * (attempt + 1)));
    return fetchPage(cursor, content, attempt + 1);
  }
  if (!response.ok) throw new Error(`durable-export HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`);
  return response.json();
}

async function fetchAll(content) {
  const pages = [];
  let cursor = 0;
  for (let n = 0; n < MAX_PAGES; n += 1) {
    const page = await fetchPage(cursor, content);
    if (page.cursor !== cursor) throw new Error(`cursor mismatch: asked ${cursor}, got ${page.cursor}`);
    if (pages.length && page.totals.all !== pages[0].totals.all) throw new Error("production changed during export; rerun");
    pages.push(page);
    if (page.nextCursor === null) return pages;
    if (!(page.nextCursor > cursor)) throw new Error("export cursor did not advance");
    cursor = page.nextCursor;
  }
  throw new Error("export exceeded the page limit");
}

async function exportArchive() {
  const out = arg("out");
  const key = resolveKey();
  const bundle = buildBundle(await fetchAll(true));
  const hmac = bundleHmac(bundle, key);
  const previous = existsSync(join(out, HMAC_FILE)) ? readFileSync(join(out, HMAC_FILE), "utf8").trim() : "";
  console.log(`archived=${bundle.manifest.archived} inventoried uploads=${bundle.manifest.inventoried} bytes=${bundle.manifest.totalBytes} byPrefix=${JSON.stringify(bundle.manifest.byPrefix)}`);
  if (hmacEquals(previous, hmac)) {
    // Content unchanged except the timestamp: keep the existing sealed bundle.
    console.log("Curriculum unchanged since the last archive; nothing to write.");
    return;
  }
  const sealed = sealBundle(bundle, key);
  // Prove the sealed bundle decrypts and verifies before it is ever written.
  const roundTrip = verifyBundle(openBundle(sealed, key));
  if (roundTrip.archived !== bundle.manifest.archived) throw new Error("round-trip verification failed");
  writeFileSync(join(out, BUNDLE_FILE), sealed);
  writeFileSync(join(out, HMAC_FILE), `${hmac}\n`);
  console.log(`Sealed ${BUNDLE_FILE} (${sealed.length} bytes) and verified the round trip.`);
}

async function verifyArchive() {
  const dir = arg("archive");
  const bundle = openBundle(readFileSync(join(dir, BUNDLE_FILE)), resolveKey());
  // The bundle timestamp is when content last changed; age is checked against the branch commit instead.
  const summary = verifyBundle(bundle, { maxAgeHours: Number.POSITIVE_INFINITY });
  const diff = compareWithProduction(bundle, await fetchAll(false));
  console.log(JSON.stringify({ ...summary, ...diff, missingFromArchive: diff.missingFromArchive.length, changedSinceArchive: diff.changedSinceArchive.length, goneFromProduction: diff.goneFromProduction }, null, 2));
  if (diff.goneFromProduction.length) {
    // Something the archive holds no longer exists in production: possible loss.
    console.log(`::error title=Curriculum missing from production::${diff.goneFromProduction.length} archived objects are no longer in production storage. Restore candidates: ${diff.goneFromProduction.slice(0, 20).join(", ")}`);
    process.exitCode = 1;
  }
}

function listFiles(root) {
  return readdirSync(root, { recursive: true }).map(String).filter((entry) => { try { return statSync(join(root, entry)).isFile(); } catch { return false; } });
}

async function restoreDrill() {
  const dir = arg("archive");
  const to = arg("to");
  if (existsSync(to) && listFiles(to).length) throw new Error("restore drill target must be empty");
  const bundle = openBundle(readFileSync(join(dir, BUNDLE_FILE)), resolveKey());
  verifyBundle(bundle, { maxAgeHours: Number.POSITIVE_INFINITY });
  const restored = restoreBundle(bundle, to);
  // Independently re-read every restored file from disk and match the manifest.
  const onDisk = listFiles(to);
  const bad = Object.entries(bundle.files).filter(([path, file]) => !existsSync(join(to, path)) || sha256(readFileSync(join(to, path))) !== file.sha256).map(([path]) => path);
  let unparsable = 0;
  for (const path of onDisk.filter((p) => p.endsWith(".json"))) { try { JSON.parse(readFileSync(join(to, path), "utf8")); } catch { unparsable += 1; } }
  console.log(JSON.stringify({ restored, onDisk: onDisk.length, mismatched: bad.length, unparsableJson: unparsable, byPrefix: bundle.manifest.byPrefix }, null, 2));
  if (restored !== bundle.manifest.archived || onDisk.length !== restored || bad.length || unparsable) {
    throw new Error("restore drill failed: restored files do not exactly match the archive manifest");
  }
  console.log("Restore drill PASSED: every archived object restored byte-for-byte.");
}

const commands = { export: exportArchive, verify: verifyArchive, "restore-drill": restoreDrill };
const command = commands[process.argv[2]];
if (!command) { console.error("usage: archive-cli.mjs export --out <dir> | verify --archive <dir> | restore-drill --archive <dir> --to <dir>"); process.exit(2); }
command().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
