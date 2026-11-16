import assert from "node:assert/strict";
import * as fs from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { gzipSync } from "node:zlib";

import {
  existsSync,
  readFileSync,
  readdirSync,
  readdirWithTypesAsync,
  readFileAsync,
  setCurriculumArchivePathForTests,
  statSync,
} from "./curriculum-fs";

// Paths that exist only in the archive (never on disk) model the deployed server,
// where the raw lesson files are not shipped.
const ARCHIVE_ONLY_DIR = join(process.cwd(), "content", "curriculum", "ZZARCHIVETEST", "L9");
const ARCHIVE_ONLY_FILE = join(ARCHIVE_ONLY_DIR, "ZZARCHIVETEST-L9-001.it.md");
const BINARY_FILE = join(process.cwd(), "content", "courses", "zzarchivetest", "level-9", "bundle.json.gz");
const REAL_DIR = join(process.cwd(), "content", "curriculum", "RED", "L1");

function writeFixtureArchive(): string {
  const dir = fs.mkdtempSync(join(tmpdir(), "curriculum-fs-"));
  const path = join(dir, "archive.bin");
  const binary = gzipSync(Buffer.from("binary-payload"));
  const files: Array<[string, Buffer]> = [
    ["content/curriculum/ZZARCHIVETEST/L9/ZZARCHIVETEST-L9-001.it.md", Buffer.from("# Lezione\n\nTesto italiano.")],
    ["content/curriculum/RED/L1/ZZARCHIVETEST-ONLY.md", Buffer.from("archive-only sibling")],
    ["content/courses/zzarchivetest/level-9/bundle.json.gz", binary],
    ["curriculum/registry.json", Buffer.from("{\"not\":\"archived root\"}")],
  ];
  const entries: Array<[string, number, number, number]> = [];
  const chunks: Buffer[] = [];
  let offset = 0;
  for (const [filePath, content] of files) {
    const packed = gzipSync(content);
    entries.push([filePath, offset, packed.length, 0]);
    chunks.push(packed);
    offset += packed.length;
  }
  const header = Buffer.from(JSON.stringify({ version: 2, files: entries }));
  const length = Buffer.alloc(4);
  length.writeUInt32BE(header.length, 0);
  fs.writeFileSync(path, Buffer.concat([Buffer.from("EDUARCH2", "ascii"), length, header, ...chunks]));
  return path;
}

test.before(() => setCurriculumArchivePathForTests(writeFixtureArchive()));
test.after(() => setCurriculumArchivePathForTests(null));

test("archive-only lesson is visible when the raw file is not on disk", () => {
  assert.equal(fs.existsSync(ARCHIVE_ONLY_FILE), false);
  assert.equal(existsSync(ARCHIVE_ONLY_FILE), true);
  assert.equal(existsSync(ARCHIVE_ONLY_DIR), true);
  assert.equal(readFileSync(ARCHIVE_ONLY_FILE, "utf8"), "# Lezione\n\nTesto italiano.");
  assert.equal(statSync(ARCHIVE_ONLY_FILE).isFile(), true);
  assert.equal(statSync(ARCHIVE_ONLY_DIR).isDirectory(), true);
  assert.deepEqual(readdirSync(ARCHIVE_ONLY_DIR), ["ZZARCHIVETEST-L9-001.it.md"]);
});

test("relative paths resolve against the repository root", () => {
  assert.equal(existsSync("content/curriculum/ZZARCHIVETEST/L9/ZZARCHIVETEST-L9-001.it.md"), true);
});

test("disk files win and directory listings merge disk and archive entries", () => {
  const disk = fs.readdirSync(REAL_DIR);
  assert.ok(disk.length > 0, "fixture expects committed RED/L1 lessons on disk");
  const merged = readdirSync(REAL_DIR);
  for (const name of disk) assert.ok(merged.includes(name), `disk entry ${name} must stay visible`);
  assert.ok(merged.includes("ZZARCHIVETEST-ONLY.md"));
  const first = disk.find((name) => name.endsWith(".md"))!;
  assert.equal(readFileSync(join(REAL_DIR, first), "utf8"), fs.readFileSync(join(REAL_DIR, first), "utf8"));
  const typed = readdirSync(REAL_DIR, { withFileTypes: true });
  assert.ok(typed.every((entry) => entry.isFile() !== entry.isDirectory()));
});

test("binary archive entries round-trip as Buffers", () => {
  const buffer = readFileSync(BINARY_FILE);
  assert.ok(Buffer.isBuffer(buffer));
  assert.equal(buffer[0], 0x1f);
  assert.equal(buffer[1], 0x8b);
});

test("paths outside the archived roots never come from the archive", () => {
  const outside = join(process.cwd(), "curriculum", "ZZARCHIVETEST-not-real.json");
  assert.equal(existsSync(outside), false);
  assert.throws(() => readFileSync(outside, "utf8"), /ENOENT/u);
});

test("missing paths still raise ENOENT", () => {
  const missing = join(process.cwd(), "content", "curriculum", "ZZARCHIVETEST", "L9", "nope.md");
  assert.equal(existsSync(missing), false);
  assert.throws(() => readFileSync(missing, "utf8"), /ENOENT/u);
  assert.throws(() => statSync(missing), /ENOENT/u);
  assert.throws(() => readdirSync(join(process.cwd(), "content", "curriculum", "ZZNOPE")), /ENOENT/u);
});

test("an archive with the wrong format is ignored instead of misread", () => {
  const dir = fs.mkdtempSync(join(tmpdir(), "curriculum-fs-bad-"));
  const bad = join(dir, "archive.bin");
  fs.writeFileSync(bad, gzipSync(Buffer.from("{}")));
  setCurriculumArchivePathForTests(bad);
  try {
    assert.equal(existsSync(ARCHIVE_ONLY_FILE), false);
  } finally {
    setCurriculumArchivePathForTests(writeFixtureArchive());
  }
});

test("promise helpers match the sync behaviour", async () => {
  assert.equal(await readFileAsync(ARCHIVE_ONLY_FILE, "utf8"), "# Lezione\n\nTesto italiano.");
  const entries = await readdirWithTypesAsync(ARCHIVE_ONLY_DIR);
  assert.equal(entries[0]?.name, "ZZARCHIVETEST-L9-001.it.md");
  assert.equal(entries[0]?.isFile(), true);
});
