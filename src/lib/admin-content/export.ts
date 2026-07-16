import type { AuditEvent, ExportPackage, ExtractedFile, UploadBatch } from "@/lib/admin-content/types";
import { getAdminContentStorage } from "@/lib/admin-content/storage";
import { nowIso, slugify } from "@/lib/admin-content/utils";
import { validateCurriculumFiles } from "@/lib/admin-content/curriculum";
import { verifyDestinationPath } from "@/lib/admin-content/security";

function writeUInt32LE(value: number) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value >>> 0, 0);
  return buffer;
}

function writeUInt16LE(value: number) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value, 0);
  return buffer;
}

function crc32(buffer: Buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function buildStoredZip(files: Array<{ path: string; content: Buffer }>) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const pathBuffer = Buffer.from(file.path, "utf8");
    const checksum = crc32(file.content);
    const localHeader = Buffer.concat([
      Buffer.from([0x50, 0x4b, 0x03, 0x04]),
      writeUInt16LE(20),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt32LE(checksum),
      writeUInt32LE(file.content.length),
      writeUInt32LE(file.content.length),
      writeUInt16LE(pathBuffer.length),
      writeUInt16LE(0),
      pathBuffer,
      file.content,
    ]);
    localParts.push(localHeader);

    const centralHeader = Buffer.concat([
      Buffer.from([0x50, 0x4b, 0x01, 0x02]),
      writeUInt16LE(20),
      writeUInt16LE(20),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt32LE(checksum),
      writeUInt32LE(file.content.length),
      writeUInt32LE(file.content.length),
      writeUInt16LE(pathBuffer.length),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt16LE(0),
      writeUInt32LE(0),
      writeUInt32LE(offset),
      pathBuffer,
    ]);
    centralParts.push(centralHeader);
    offset += localHeader.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const endRecord = Buffer.concat([
    Buffer.from([0x50, 0x4b, 0x05, 0x06]),
    writeUInt16LE(0),
    writeUInt16LE(0),
    writeUInt16LE(files.length),
    writeUInt16LE(files.length),
    writeUInt32LE(centralDirectory.length),
    writeUInt32LE(offset),
    writeUInt16LE(0),
  ]);

  return Buffer.concat([...localParts, centralDirectory, endRecord]);
}

function buildRejectedSummary(files: ExtractedFile[]) {
  return files
    .filter((file) => file.reviewStatus !== "approved")
    .map((file) => ({ id: file.id, file: file.originalFilename, status: file.reviewStatus, warnings: file.warnings, error: file.error }));
}

export async function createExportPackage(batch: UploadBatch) {
  const approvedFiles = batch.files.filter((file) => file.reviewStatus === "approved");
  if (approvedFiles.length === 0) {
    throw new Error("At least one file must be approved before exporting.");
  }

  const normalizedFiles = approvedFiles.map((file) => ({
    destination: verifyDestinationPath(file.classification.destination || file.metadata.intendedDestination),
    content: Buffer.from(file.encodedContent, "base64"),
    text: file.rawText,
    file,
  }));
  const validation = await validateCurriculumFiles(normalizedFiles.map((entry) => ({ destination: entry.destination, content: entry.text })));
  const manifest = {
    batchId: batch.id,
    batchName: batch.name,
    generatedAt: nowIso(),
    approvedCount: approvedFiles.length,
    files: normalizedFiles.map((entry) => ({
      id: entry.file.id,
      source: entry.file.originalFilename,
      destination: entry.destination,
      checksum: entry.file.checksum,
      classification: entry.file.classification,
    })),
  };
  const warnings = {
    warnings: [...batch.warnings, ...batch.files.flatMap((file) => file.warnings), ...validation.warnings],
  };
  const auditSummary = batch.auditHistory.map((event: AuditEvent) => ({
    timestamp: event.timestamp,
    action: event.action,
    actor: event.actor,
    fileId: event.fileId ?? null,
    result: event.result,
  }));
  const rejectedFiles = buildRejectedSummary(batch.files);

  const archiveFiles = [
    ...normalizedFiles.map((entry) => ({ path: entry.destination, content: entry.content })),
    { path: `curriculum/staging/content-upload/${slugify(batch.slug)}/manifest.json`, content: Buffer.from(JSON.stringify(manifest, null, 2)) },
    { path: `curriculum/staging/content-upload/${slugify(batch.slug)}/audit-summary.json`, content: Buffer.from(JSON.stringify(auditSummary, null, 2)) },
    { path: `curriculum/staging/content-upload/${slugify(batch.slug)}/warnings.json`, content: Buffer.from(JSON.stringify(warnings, null, 2)) },
    { path: `curriculum/staging/content-upload/${slugify(batch.slug)}/rejected-files.json`, content: Buffer.from(JSON.stringify(rejectedFiles, null, 2)) },
  ];

  const archive = buildStoredZip(archiveFiles);
  const exportId = `export_${batch.id}_${Date.now()}`;
  const fileName = `${batch.slug}-approved-content.zip`;
  const exportPackage: ExportPackage = {
    id: exportId,
    batchId: batch.id,
    fileName,
    storagePath: `exports/${exportId}.zip`,
    manifestPath: `curriculum/staging/content-upload/${slugify(batch.slug)}/manifest.json`,
    auditSummaryPath: `curriculum/staging/content-upload/${slugify(batch.slug)}/audit-summary.json`,
    warningsPath: `curriculum/staging/content-upload/${slugify(batch.slug)}/warnings.json`,
    rejectedFilesPath: `curriculum/staging/content-upload/${slugify(batch.slug)}/rejected-files.json`,
    createdAt: nowIso(),
    validation,
  };

  await getAdminContentStorage().createExport(exportPackage, archive);
  return exportPackage;
}
