import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";

import { createIndependentUploadBatchFromStoredFiles } from "@/lib/admin-content/stored-upload-finalizer";
import { getAdminContentStorage, resetAdminContentStorage } from "@/lib/admin-content/storage";
import type { CourseUploadConfig } from "@/lib/admin-content/upload-intake";

// Launch proof: exercise the same stored-upload finalizer used by production.
function makeStoredZip(entries: Array<{ name: string; data: Buffer }>) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(0, 14);
    local.writeUInt32LE(entry.data.length, 18);
    local.writeUInt32LE(entry.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, name, entry.data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(0, 14);
    central.writeUInt32LE(0, 16);
    central.writeUInt32LE(entry.data.length, 20);
    central.writeUInt32LE(entry.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);

    offset += local.length + name.length + entry.data.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDirectory.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, eocd]);
}

const baseConfig: CourseUploadConfig = {
  destination: "courses",
  track: "red",
  level: "level-1",
  language: "en",
  membershipAccess: "basic",
  publicationStatus: "draft",
  title: "Bulk curriculum upload",
  description: "Mixed curriculum batch proof",
};

afterEach(() => resetAdminContentStorage());

describe("stored mixed curriculum bulk upload", () => {
  test("keeps every ZIP package independent across color, level, language and extracted media", async () => {
    resetAdminContentStorage();
    const storage = getAdminContentStorage();
    const png = Buffer.from("89504e470d0a1a0a00000000", "hex");

    const packages = [
      {
        uploadId: "upload_red",
        originalFilename: "RED-level-1-Real-Estate-en-US.zip",
        storagePath: "incoming/red.zip",
        data: makeStoredZip([
          { name: "RED-L1-001.md", data: Buffer.from("# Red lesson\nReal estate basics.") },
          { name: "red-house.png", data: png },
        ]),
        expected: { pillar: "red", level: "level-1", language: "en-US", path: "/red/level-1/en_us/" },
      },
      {
        uploadId: "upload_green",
        originalFilename: "GREEN-level-2-Tax-Strategy-fr-CA.zip",
        storagePath: "incoming/green.zip",
        data: makeStoredZip([
          { name: "GREEN-L2-001.md", data: Buffer.from("# Lecon fiscale\nStrategie fiscale.") },
          { name: "green-tax.png", data: png },
        ]),
        expected: { pillar: "green", level: "level-2", language: "fr-CA", path: "/green/level-2/fr_ca/" },
      },
      {
        uploadId: "upload_blue",
        originalFilename: "BLUE-level-3-Entrepreneurship-es-ES.zip",
        storagePath: "incoming/blue.zip",
        data: makeStoredZip([
          { name: "BLUE-L3-001.md", data: Buffer.from("# Empresa\nCrecimiento empresarial.") },
          { name: "blue-business.png", data: png },
        ]),
        expected: { pillar: "blue", level: "level-3", language: "es-ES", path: "/blue/level-3/es_es/" },
      },
    ] as const;

    for (const item of packages) {
      await storage.saveBinary(item.storagePath, item.data, "application/zip");
    }

    const batch = await createIndependentUploadBatchFromStoredFiles(
      new Request("https://edunancial.com/api/admin/content/upload/finalize", {
        headers: { "x-forwarded-for": "127.0.0.1" },
      }),
      { email: "owner@edunancial.test" },
      {
        batchId: "batch_mixed_curriculum",
        batchName: "Mixed curriculum proof",
        source: "integration-test",
        notes: "",
        uploadConfig: baseConfig,
        uploads: packages.map((item) => ({
          uploadId: item.uploadId,
          originalFilename: item.originalFilename,
          mimeType: "application/zip",
          sizeBytes: item.data.length,
          storagePath: item.storagePath,
        })),
      },
    );

    assert.equal(batch.warnings.length, 0);
    assert.equal(batch.uploads.length, 3);
    assert.equal(batch.files.length, 6);

    for (const item of packages) {
      const files = batch.files.filter((file) => file.sourceArchiveFilename === item.originalFilename);
      assert.equal(files.length, 2, item.originalFilename);
      for (const file of files) {
        assert.equal(file.classification.pillar, item.expected.pillar);
        assert.equal(file.classification.academyLevel, item.expected.level);
        assert.equal(file.classification.language, item.expected.language);
        assert.equal(file.metadata.pillar, item.expected.pillar);
        assert.equal(file.metadata.academyLevel, item.expected.level);
        assert.equal(file.metadata.language, item.expected.language);
        assert.match(file.classification.destination, new RegExp(item.expected.path.replaceAll("/", "\\/")));
      }
    }

    const imageFiles = batch.files.filter((file) => file.extension === ".png");
    assert.equal(imageFiles.length, 3);
    assert.ok(imageFiles.every((file) => file.mimeType === "image/png"));
  });
});
