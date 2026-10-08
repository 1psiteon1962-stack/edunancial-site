#!/usr/bin/env node
/**
 * Read-only backup of the durable curriculum store through
 * /api/admin/curriculum/backup-export. Writes every object to
 * <out>/blobs/<key> and a manifest with sha256 per object.
 *
 * Auth: same as production-audit.mjs (GitHub Actions run headers or
 * EDUNANCIAL_ADMIN_COOKIE).
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const base = (process.env.EDUNANCIAL_BASE_URL ?? "https://edunancial.com").replace(/\/+$/u, "");
const out = process.argv[2] ?? "backup";

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
async function get(query, attempt = 0) {
  const response = await fetch(`${base}/api/admin/curriculum/backup-export?${new URLSearchParams(query)}`, { headers: headers() });
  if (!response.ok) {
    if (attempt < 3 && response.status !== 401) { await new Promise((r) => setTimeout(r, 2000 * (attempt + 1))); return get(query, attempt + 1); }
    throw new Error(`backup-export ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  return response.json();
}

const { keys } = await get({ list: "1" });
console.log(`objects to back up: ${keys.length}`);
const manifest = [];
const oversized = [];
let pending = [...keys];
while (pending.length) {
  const group = pending.slice(0, 40);
  const { objects, truncatedAt } = await get({ keys: group.join(",") });
  for (const object of objects) {
    if (object.tooLargeBytes) { oversized.push({ key: object.key, bytes: object.tooLargeBytes }); continue; }
    if (object.base64 === null) { manifest.push({ key: object.key, missing: true }); continue; }
    const data = Buffer.from(object.base64, "base64");
    const target = join(out, "blobs", object.key);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, data);
    manifest.push({ key: object.key, bytes: data.length, sha256: createHash("sha256").update(data).digest("hex") });
  }
  const done = new Set(objects.map((o) => o.key));
  pending = truncatedAt ? pending.filter((k) => !done.has(k)) : pending.slice(group.length);
  process.stderr.write(".");
}
process.stderr.write("\n");
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "manifest.json"), JSON.stringify({ base, takenAt: new Date().toISOString(), objects: manifest.length, oversized, manifest }, null, 2));
console.log(`backed up ${manifest.length} objects; oversized (not exportable over HTTP): ${oversized.length}`);
if (manifest.length === 0) { console.error("Backup is empty — refusing to report success."); process.exit(1); }
