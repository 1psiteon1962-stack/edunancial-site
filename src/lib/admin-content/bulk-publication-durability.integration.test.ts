import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { createIndependentUploadBatchFromStoredFiles } from "@/lib/admin-content/stored-upload-finalizer";
import { autoPublishTrustedLocalizedLevel1Batch } from "@/lib/admin-content/trusted-localized-ingest";
import { getAdminContentStorage, resetAdminContentStorage } from "@/lib/admin-content/storage";
import { getPublishedTracks } from "@/lib/curriculum/authoritative-published";
import { invalidateTranslationPackageCache } from "@/lib/curriculum/translation-package-store";
import type { CourseUploadConfig } from "@/lib/admin-content/upload-intake";

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
    local.writeUInt32LE(entry.data.length, 18);
    local.writeUInt32LE(entry.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    localParts.push(local, name, entry.data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt32LE(entry.data.length, 20);
    central.writeUInt32LE(entry.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);
    offset += local.length + name.length + entry.data.length;
  }
  const centralDirectory = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDirectory.length, 12);
  eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...localParts, centralDirectory, eocd]);
}

const config: CourseUploadConfig = {
  destination: "courses",
  track: "red",
  level: "level-1",
  language: "es-Caribbean",
  membershipAccess: "basic",
  publicationStatus: "published",
  title: "RED Level 1 Caribbean Spanish",
  description: "End-to-end bulk publication durability test",
};

afterEach(() => {
  invalidateTranslationPackageCache();
  resetAdminContentStorage();
});

test("50-lesson stored ZIP publishes atomically and is immediately learner-visible", async () => {
  resetAdminContentStorage();
  invalidateTranslationPackageCache();
  const storage = getAdminContentStorage();
  const entries = Array.from({ length: 50 }, (_, index) => {
    const number = String(index + 1).padStart(3, "0");
    const id = `RED-L1-${number}`;
    const body = `---
id: ${id}
track: RED
officialTrackName: Real Estate
level: 1
lessonNumber: ${index + 1}
title: Prueba de publicación ${number}
summary: Resumen de prueba ${number}
version: 1.0
author: Edunancial Faculty
date: 2026-10-01
locale: es-Caribbean
---

## Objetivos de aprendizaje

Contenido localizado de prueba para ${id}. Este texto confirma que el paquete masivo publicado se resuelve desde el catálogo del alumno.
`;
    return { name: `${id}.md`, data: Buffer.from(body, "utf8") };
  });
  const zip = makeStoredZip(entries);
  const storagePath = "incoming/red-l1-es-caribbean-durability.zip";
  await storage.saveBinary(storagePath, zip, "application/zip");

  const batch = await createIndependentUploadBatchFromStoredFiles(
    new Request("https://edunancial.com/api/admin/content/upload/finalize", {
      headers: { "x-forwarded-for": "127.0.0.1" },
    }),
    { email: "owner@edunancial.test" },
    {
      batchId: "batch_bulk_publication_durability",
      batchName: "Bulk publication durability",
      source: "integration-test",
      notes: "",
      uploadConfig: config,
      uploads: [{
        uploadId: "upload_bulk_publication_durability",
        originalFilename: "RED-L1-001-050-es-Caribbean.zip",
        mimeType: "application/zip",
        sizeBytes: zip.length,
        storagePath,
      }],
    },
  );

  const result = await autoPublishTrustedLocalizedLevel1Batch(
    batch,
    { track: "red", level: "level-1", language: "es-Caribbean", title: "RED Level 1 Caribbean Spanish" },
    { requireAtomic: true },
  );

  assert.equal(result.attempted, true);
  assert.equal(result.approvedFiles, 50);
  assert.equal(result.translated, 50);
  assert.deepEqual(result.missingLessonIds, []);

  invalidateTranslationPackageCache();
  const red = (await getPublishedTracks("es-Caribbean")).find((track) => track.code === "RED");
  const level = red?.levels.find((entry) => entry.level === 1);
  assert.equal(level?.lessons.length, 50);
  assert.equal(level?.lessons[0]?.title, "Prueba de publicación 001");
  assert.match(level?.lessons[49]?.body ?? "", /RED-L1-050/u);
});
