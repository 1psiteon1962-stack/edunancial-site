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
const concurrency = Number(arg("concurrency", "3"));

function headers() {
  const h = { accept: "application/json" };
  if (process.env.EDUNANCIAL_ADMIN_COOKIE) h.cookie = process.env.EDUNANCIAL_ADMIN_COOKIE;
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_RUN_ID) {
