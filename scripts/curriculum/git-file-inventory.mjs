#!/usr/bin/env node
// Read-only Git curriculum file inventory. Not a Blob or database backup.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, lstatSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const root = resolve(process.cwd());
const source = join(root, "content", "curriculum");
const output = join(root, "reports", "curriculum-preservation", "git-file-inventory.json");
const records = [];
const naming = /^([A-Z]+)-L([1-5])-(\d{3})(?:\.([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*))?\.md$/;

function scan(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = join(directory, entry.name);
    if (entry.isSymbolicLink() || lstatSync(absolute).isSymbolicLink()) throw new Error("Curriculum symlink refused: " + relative(root, absolute));
    if (entry.isDirectory()) { scan(absolute); continue; }
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const rel = relative(root, absolute).split(sep).join("/");
    const parts = rel.split("/");
    const match = naming.exec(entry.name);
    const valid = Boolean(match && parts.length === 5 && parts[2] === match[1] && parts[3] === "L" + match[2]);
    const bytes = readFileSync(absolute);
    records.push({ path: rel, lessonId: valid ? match[1] + "-L" + match[2] + "-" + match[3] : null, locale: valid ? (match[4] ?? "en-US") : null, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), canonicalName: valid });
  }
}
scan(source);
records.sort((a, b) => a.path.localeCompare(b.path));
const manifest = { scope: "Git content/curriculum Markdown only; NOT a Blob backup or proof of learner publication", fileCount: records.length, invalidNameCount: records.filter((r) => !r.canonicalName).length, records };
mkdirSync(join(root, "reports", "curriculum-preservation"), { recursive: true });
writeFileSync(output, JSON.stringify(manifest, null, 2) + "\n");
console.log("Git curriculum inventory: " + records.length + " Markdown files; " + manifest.invalidNameCount + " noncanonical filenames. This is NOT a Blob backup.");
