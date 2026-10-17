import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";

const script = resolve("scripts/curriculum/git-file-inventory.mjs");

test("Q2 inventory includes every committed locale with source SHA-256 without changing lesson bytes", () => {
  const root = mkdtempSync(join(tmpdir(), "edunancial-inventory-"));
  try {
    const folder = join(root, "content", "curriculum", "RED", "L1");
    mkdirSync(folder, { recursive: true });
    const original = new Map([
      ["RED-L1-001.md", "# Original English lesson\n"],
      ["RED-L1-001.fr-CA.md", "# Leçon canadienne\n"],
      ["RED-L1-002.md", "# Second lesson\n"],
    ]);
    for (const [file, body] of original) writeFileSync(join(folder, file), body);
    const result = spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const inventory = JSON.parse(readFileSync(join(root, "reports", "curriculum-preservation", "git-file-inventory.json"), "utf8"));
    assert.equal(inventory.fileCount, 3);
    assert.equal(inventory.invalidNameCount, 0);
    assert.deepEqual(inventory.records.map((entry) => entry.locale).sort(), ["en-US", "en-US", "fr-CA"]);
    for (const [name, body] of original) {
      const record = inventory.records.find((entry) => entry.path.endsWith("/" + name));
      assert.ok(record, name);
      assert.equal(record.sha256, createHash("sha256").update(body).digest("hex"));
      assert.equal(readFileSync(join(folder, name), "utf8"), body);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("Q2 inventory fails closed when curriculum source is missing", () => {
  const root = mkdtempSync(join(tmpdir(), "edunancial-missing-curriculum-"));
  try {
    const result = spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
    assert.notEqual(result.status, 0, "missing curriculum must never yield an empty successful inventory");
    assert.equal(result.stdout.includes("Git curriculum inventory:"), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
