import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { cuUploadInternals, filesFromFormData } from "@/lib/cu/uploads";

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

function makeZip(entries: Array<{ name: string; content: Buffer }>) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuffer = Buffer.from(entry.name, "utf8");
    const local = Buffer.concat([
      Buffer.from([0x50, 0x4b, 0x03, 0x04]),
      writeUInt16LE(20),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt32LE(0),
      writeUInt32LE(entry.content.length),
      writeUInt32LE(entry.content.length),
      writeUInt16LE(nameBuffer.length),
      writeUInt16LE(0),
      nameBuffer,
      entry.content,
    ]);
    localParts.push(local);

    const central = Buffer.concat([
      Buffer.from([0x50, 0x4b, 0x01, 0x02]),
      writeUInt16LE(20),
      writeUInt16LE(20),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt32LE(0),
      writeUInt32LE(entry.content.length),
      writeUInt32LE(entry.content.length),
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

describe("CU uploads", () => {
  test("rejects ZIP traversal entries", () => {
    const archive = makeZip([{ name: "../../escape.txt", content: Buffer.from("blocked") }]);
    assert.throws(() => cuUploadInternals.readZipEntries(archive), /unsafe path/i);
  });

  test("extracts ZIP uploads from form data", async () => {
    const archive = makeZip([{ name: "lesson.md", content: Buffer.from("# Lesson") }]);
    const formData = new FormData();
    formData.append("files", new File([archive], "bundle.zip", { type: "application/zip" }));

    const files = await filesFromFormData(formData);
    assert.equal(files.length, 1);
    assert.equal(files[0]?.name, "lesson.md");
    assert.equal(files[0]?.textContent, "# Lesson");
  });
});
