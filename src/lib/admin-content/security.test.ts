import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { extractZipEntries, normalizeUploadFilename, validateFileSize, validateFileType } from "@/lib/admin-content/security";

function writeUInt16LE(value: number) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value, 0);
  return buffer;
}

function writeUInt32LE(value: number) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value >>> 0, 0);
  return buffer;
}

function makeZip(entries: Array<{ name: string; content?: Buffer; encrypted?: boolean }>) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;
  for (const entry of entries) {
    const content = entry.content ?? Buffer.alloc(0);
    const nameBuffer = Buffer.from(entry.name, "utf8");
    const flag = entry.encrypted ? 1 : 0;
    const local = Buffer.concat([
      Buffer.from([0x50, 0x4b, 0x03, 0x04]),
      writeUInt16LE(20),
      writeUInt16LE(flag),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt32LE(0),
      writeUInt32LE(content.length),
      writeUInt32LE(content.length),
      writeUInt16LE(nameBuffer.length),
      writeUInt16LE(0),
      nameBuffer,
      content,
    ]);
    localParts.push(local);

    const central = Buffer.concat([
      Buffer.from([0x50, 0x4b, 0x01, 0x02]),
      writeUInt16LE(20),
      writeUInt16LE(20),
      writeUInt16LE(flag),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt32LE(0),
      writeUInt32LE(content.length),
      writeUInt32LE(content.length),
      writeUInt16LE(nameBuffer.length),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt32LE(0),
      writeUInt32LE(offset),
      nameBuffer,
    ]);
    centralParts.push(central);
    offset += local.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  return Buffer.concat([
    ...localParts,
    centralDirectory,
    Buffer.from([0x50, 0x4b, 0x05, 0x06]),
    writeUInt16LE(0),
    writeUInt16LE(0),
    writeUInt16LE(entries.length),
    writeUInt16LE(entries.length),
    writeUInt32LE(centralDirectory.length),
    writeUInt32LE(offset),
    writeUInt16LE(0),
  ]);
}

describe("admin-content security", () => {
  test("normalizes potentially unsafe filenames", () => {
    assert.equal(normalizeUploadFilename("<script>alert(1)</script>.md"), "script-alert-1-script.md");
  });

  test("rejects mismatched MIME types", () => {
    assert.throws(
      () => validateFileType("document.pdf", "application/pdf", Buffer.from("89504e470d0a1a0a", "hex")),
      /MIME type/,
    );
  });

  test("rejects traversal ZIP entries", () => {
    const archive = makeZip([{ name: "../../evil.txt", content: Buffer.from("oops") }]);
    assert.throws(() => extractZipEntries(archive), /path traversal/i);
  });

  test("rejects duplicate ZIP filenames", () => {
    const archive = makeZip([
      { name: "docs/lesson.md", content: Buffer.from("one") },
      { name: "docs/lesson.md", content: Buffer.from("two") },
    ]);
    assert.throws(() => extractZipEntries(archive), /duplicate filenames/i);
  });

  test("rejects password-protected ZIP entries", () => {
    const archive = makeZip([{ name: "locked.md", content: Buffer.from("secret"), encrypted: true }]);
    assert.throws(() => extractZipEntries(archive), /Password-protected ZIP/);
  });

  test("rejects invalid ZIP and empty ZIP cases", () => {
    assert.throws(() => extractZipEntries(Buffer.from("not-a-zip")), /Invalid ZIP/);
    assert.throws(() => extractZipEntries(makeZip([])), /empty/);
  });

  test("accepts files up to 50 MB and rejects larger files", () => {
    const limit = 50 * 1024 * 1024;
    assert.doesNotThrow(() => validateFileSize(limit));
    assert.throws(() => validateFileSize(limit + 1), /Upload exceeds/);
  });
});
