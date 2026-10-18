import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import {
  BUNDLE_FILE, HMAC_FILE, buildBundle, bundleHmac, compareWithProduction, openBundle, resolveKey,
  restoreBundle, sealBundle, verifyBundle,
} from "../archive/archive-lib.mjs";

const KEY_B64 = randomBytes(32).toString("base64");
const KEY = Buffer.from(KEY_B64, "base64");
const cli = resolve("scripts/curriculum/archive/archive-cli.mjs");
const hash = (buffer) => createHash("sha256").update(buffer).digest("hex");

function storeObjects() {
  return {
    "published/atomic/lessons/RED-L1-001.json": Buffer.from(JSON.stringify({ id: "RED-L1-001", title: "Lesson one" })),
    "published/atomic/translation-packages/RED-L1/pt-BR.json": Buffer.from(JSON.stringify({ lessons: { "RED-L1-001": { title: "Lição um" } } })),
    "receipts/upload_1.json": Buffer.from(JSON.stringify({ uploadId: "upload_1", state: "PUBLISHED" })),
    "uploads/upload_1-red-l1-pt-br.zip": randomBytes(64),
  };
}

function page(objects, { generatedAt = new Date().toISOString(), content = true, drop = [] } = {}) {
  const archive = Object.keys(objects).filter((p) => !p.startsWith("uploads/")).sort();
  const inventory = Object.keys(objects).filter((p) => p.startsWith("uploads/")).sort();
  const entries = [...archive, ...inventory].filter((p) => !drop.includes(p)).map((path) => {
    const data = objects[path];
    const kind = path.startsWith("uploads/") ? "inventory" : "archive";
    return { path, kind, size: data.length, sha256: hash(data), ...(content && kind === "archive" ? { contentBase64: data.toString("base64") } : {}) };
  });
  return { generatedAt, totals: { archive: archive.length, inventory: inventory.length, all: archive.length + inventory.length }, cursor: 0, nextCursor: null, entries, missing: [] };
}

test("Q2 archive: key comes from the curriculum secret, else the existing blog archive secret", () => {
  assert.deepEqual(resolveKey({ BLOG_ARCHIVE_ENCRYPTION_KEY: KEY_B64 }), KEY);
  const other = randomBytes(32).toString("base64");
  assert.deepEqual(resolveKey({ CURRICULUM_ARCHIVE_ENCRYPTION_KEY: other, BLOG_ARCHIVE_ENCRYPTION_KEY: KEY_B64 }), Buffer.from(other, "base64"));
  assert.throws(() => resolveKey({}), /No archive key/u);
  assert.throws(() => resolveKey({ BLOG_ARCHIVE_ENCRYPTION_KEY: "c2hvcnQ=" }), /32 bytes/u);
});

test("Q2 archive: sealed bundle round-trips, contains no plaintext, and rejects wrong keys and tampering", () => {
  const bundle = buildBundle([page(storeObjects())]);
  const sealed = sealBundle(bundle, KEY);
  assert.equal(sealed.includes(Buffer.from("Lesson one")), false, "no plaintext lesson text in the sealed bundle");
  assert.equal(sealed.includes(Buffer.from("RED-L1-001")), false, "no plaintext lesson IDs in the sealed bundle");
  assert.deepEqual(openBundle(sealed, KEY), JSON.parse(JSON.stringify(bundle)));
  assert.throws(() => openBundle(sealed, randomBytes(32)), /failed authentication/u);
  const tampered = Buffer.from(sealed); tampered[tampered.length - 1] ^= 1;
  assert.throws(() => openBundle(tampered, KEY), /failed authentication/u);
});

test("Q2 archive: building a bundle fails closed on any incomplete or altered export", () => {
  const objects = storeObjects();
  assert.throws(() => buildBundle([page(objects, { drop: ["receipts/upload_1.json"] })]), /archived 2 objects but production listed 3/u);
  const altered = page(objects);
  altered.entries[0].contentBase64 = Buffer.from("altered").toString("base64");
  assert.throws(() => buildBundle([altered]), /checksum mismatch/u);
  const large = page(objects);
  delete large.entries[0].contentBase64; large.entries[0].tooLarge = true;
  assert.throws(() => buildBundle([large]), /too large/u);
  const unreadable = page(objects); unreadable.missing = ["published/x.json"];
  assert.throws(() => buildBundle([unreadable]), /unreadable/u);
  assert.throws(() => buildBundle([page({ "uploads/a.zip": randomBytes(4) })]), /empty backup/u);
});

test("Q2 archive: change detection ignores the export time but sees any content change", () => {
  const objects = storeObjects();
  const a = buildBundle([page(objects, { generatedAt: "2026-10-18T00:00:00.000Z" })]);
  const b = buildBundle([page(objects, { generatedAt: "2026-10-19T00:00:00.000Z" })]);
  assert.equal(bundleHmac(a, KEY), bundleHmac(b, KEY));
  const changed = { ...objects, "receipts/upload_1.json": Buffer.from(JSON.stringify({ uploadId: "upload_1", state: "FAILED" })) };
  assert.notEqual(bundleHmac(a, KEY), bundleHmac(buildBundle([page(changed)]), KEY));
});

test("Q2 archive: verification catches corruption, and production comparison flags lost objects", () => {
  const objects = storeObjects();
  const bundle = buildBundle([page(objects)]);
  assert.equal(verifyBundle(bundle).archived, 3);
  const corrupt = JSON.parse(JSON.stringify(bundle));
  corrupt.files["receipts/upload_1.json"].contentBase64 = Buffer.from("x").toString("base64");
  assert.throws(() => verifyBundle(corrupt), /corrupt: receipts\/upload_1\.json/u);
  assert.throws(() => verifyBundle({ ...bundle, manifest: { ...bundle.manifest, generatedAt: "2020-01-01T00:00:00Z" } }), /hours old/u);

  const live = { ...objects };
  delete live["receipts/upload_1.json"];
  live["receipts/upload_2.json"] = Buffer.from("{}");
  const diff = compareWithProduction(bundle, [page(live, { content: false })]);
  assert.deepEqual(diff.goneFromProduction, ["receipts/upload_1.json"]);
  assert.deepEqual(diff.missingFromArchive, ["receipts/upload_2.json"]);
});

test("Q2 archive: restore never writes outside its target directory", () => {
  const bundle = buildBundle([page(storeObjects())]);
  bundle.files["../escape.json"] = bundle.files["receipts/upload_1.json"];
  const dir = mkdtempSync(join(tmpdir(), "archive-escape-"));
  try { assert.throws(() => restoreBundle(bundle, dir), /outside the target directory/u); }
  finally { rmSync(dir, { recursive: true, force: true }); }
});

function fakeProduction(objects) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(page(objects.current, { content: url.searchParams.get("content") !== "0" })));
  });
  return new Promise((done) => server.listen(0, "127.0.0.1", () => done(server)));
}

function runCli(args, port) {
  return new Promise((done) => {
    const child = spawn(process.execPath, [cli, ...args], { env: { PATH: process.env.PATH, BLOG_ARCHIVE_ENCRYPTION_KEY: KEY_B64, CURRICULUM_ARCHIVE_BASE_URL: `http://127.0.0.1:${port}` } });
    let out = ""; child.stdout.on("data", (d) => { out += d; }); child.stderr.on("data", (d) => { out += d; });
    child.on("close", (status) => done({ status, out }));
  });
}

test("Q2 archive: export, verify and restore drill work end to end and detect loss", async () => {
  const objects = { current: storeObjects() };
  const server = await fakeProduction(objects);
  const archiveDir = mkdtempSync(join(tmpdir(), "archive-branch-"));
  const restoreDir = join(mkdtempSync(join(tmpdir(), "archive-restore-")), "store");
  try {
    const port = server.address().port;
    const exported = await runCli(["export", "--out", archiveDir], port);
    assert.equal(exported.status, 0, exported.out);
    assert.ok(existsSync(join(archiveDir, BUNDLE_FILE)) && existsSync(join(archiveDir, HMAC_FILE)));
    const firstBundle = readFileSync(join(archiveDir, BUNDLE_FILE));

    const unchanged = await runCli(["export", "--out", archiveDir], port);
    assert.equal(unchanged.status, 0, unchanged.out);
    assert.match(unchanged.out, /unchanged/u);
    assert.ok(readFileSync(join(archiveDir, BUNDLE_FILE)).equals(firstBundle), "unchanged curriculum keeps the same sealed file");

    const verified = await runCli(["verify", "--archive", archiveDir], port);
    assert.equal(verified.status, 0, verified.out);

    const drill = await runCli(["restore-drill", "--archive", archiveDir, "--to", restoreDir], port);
    assert.equal(drill.status, 0, drill.out);
    assert.match(drill.out, /Restore drill PASSED/u);
    assert.equal(readFileSync(join(restoreDir, "receipts/upload_1.json"), "utf8"), objects.current["receipts/upload_1.json"].toString("utf8"));

    // Simulate production losing a published translation package.
    const lost = { ...objects.current };
    delete lost["published/atomic/translation-packages/RED-L1/pt-BR.json"];
    objects.current = lost;
    const lossCheck = await runCli(["verify", "--archive", archiveDir], port);
    assert.equal(lossCheck.status, 1, lossCheck.out);
    assert.match(lossCheck.out, /Curriculum missing from production/u);
  } finally {
    server.close();
    rmSync(archiveDir, { recursive: true, force: true });
    rmSync(restoreDir, { recursive: true, force: true });
  }
});
