import { randomUUID } from "node:crypto";
import { basename, extname, normalize } from "node:path";
import { inflateRawSync } from "node:zlib";

import {
  ALLOWED_ARCHIVE_EXTENSIONS,
  ALLOWED_EXTENSIONS,
  ALLOWED_TEXT_EXTENSIONS,
  MAX_CU_FILE_SIZE_BYTES,
  MAX_CU_FILES_PER_BATCH,
  MAX_CU_ZIP_TOTAL_BYTES,
  MIME_BY_EXTENSION,
} from "@/lib/cu/constants";
import type { CuCategory, CuFileRecord } from "@/lib/cu/types";

const ZIP_LOCAL_SIGNATURE = 0x04034b50;
const ZIP_CENTRAL_SIGNATURE = 0x02014b50;
const ZIP_END_SIGNATURE = 0x06054b50;

function sanitizeFilename(name: string) {
  return basename(name)
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 120) || "upload";
}

function normalizedEntryPath(name: string) {
  const cleaned = normalize(name).replace(/\\/g, "/");
  if (!cleaned || cleaned === "." || cleaned === ".." || cleaned.startsWith("../") || cleaned.includes("/../") || cleaned.startsWith("/")) {
    throw new Error(`ZIP entry \"${name}\" uses an unsafe path.`);
  }
  return cleaned;
}

function detectCategory(extension: string): CuCategory {
  if (extension === ".pdf" || extension === ".doc" || extension === ".docx") return "books";
  if (extension === ".md" || extension === ".markdown") return "courses";
  if (extension === ".html" || extension === ".htm") return "articles";
  if (extension === ".json" || extension === ".csv" || extension === ".xml") return "resources";
  return "downloads";
}

function isTextExtension(extension: string) {
  return ALLOWED_TEXT_EXTENSIONS.has(extension);
}

function mimeFromName(name: string, fallback?: string) {
  const extension = extname(name).toLowerCase();
  return MIME_BY_EXTENSION[extension] || fallback || "application/octet-stream";
}

function textFromBuffer(buffer: Buffer, extension: string) {
  if (extension === ".docx") {
    return extractDocxText(buffer);
  }

  if (!isTextExtension(extension)) {
    return null;
  }

  return buffer.toString("utf8");
}

function decodeXmlText(value: string) {
  const normalized = value
    .replace(/<w:tab\/?\s*>/g, "\t")
    .replace(/<w:br\/?\s*>/g, "\n")
    .replace(/<\/w:p>/g, "\n\n");

  const textRuns = Array.from(normalized.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g), (match) => match[1] || "");
  const joined = textRuns.join("");

  return joined
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractDocxText(buffer: Buffer) {
  try {
    const entries = readZipEntries(buffer);
    const documentEntry = entries.find((entry) => entry.relativePath === "word/document.xml");
    if (!documentEntry) {
      return "DOCX preview unavailable: word/document.xml was not found.";
    }

    return decodeXmlText(documentEntry.buffer.toString("utf8")) || "DOCX preview did not contain readable text.";
  } catch {
    return "DOCX preview unavailable.";
  }
}

function readZipEntries(buffer: Buffer) {
  let endOffset = -1;
  for (let index = buffer.length - 22; index >= 0; index -= 1) {
    if (buffer.readUInt32LE(index) === ZIP_END_SIGNATURE) {
      endOffset = index;
      break;
    }
  }

  if (endOffset < 0) {
    throw new Error("Invalid ZIP archive.");
  }

  const directoryOffset = buffer.readUInt32LE(endOffset + 16);
  const entryCount = buffer.readUInt16LE(endOffset + 8);
  if (entryCount === 0) {
    throw new Error("ZIP archive is empty.");
  }
  if (entryCount > MAX_CU_FILES_PER_BATCH) {
    throw new Error(`ZIP archive contains too many files (${entryCount}).`);
  }

  const entries: Array<{ relativePath: string; buffer: Buffer }> = [];
  const seen = new Set<string>();
  let totalSize = 0;
  let offset = directoryOffset;

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(offset) !== ZIP_CENTRAL_SIGNATURE) {
      throw new Error("Invalid ZIP central directory.");
    }

    const flags = buffer.readUInt16LE(offset + 8);
    if ((flags & 0x1) !== 0) {
      throw new Error("Password-protected ZIP files are not supported.");
    }

    const compressionMethod = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    const filenameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const relativePath = normalizedEntryPath(buffer.slice(offset + 46, offset + 46 + filenameLength).toString("utf8"));
    offset += 46 + filenameLength + extraLength + commentLength;

    if (relativePath.endsWith("/")) {
      continue;
    }

    if (seen.has(relativePath)) {
      throw new Error(`ZIP archive contains duplicate filenames: ${relativePath}`);
    }
    seen.add(relativePath);

    const extension = extname(relativePath).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension) || ALLOWED_ARCHIVE_EXTENSIONS.has(extension)) {
      throw new Error(`Unsupported file inside ZIP: ${relativePath}`);
    }

    if (uncompressedSize > MAX_CU_FILE_SIZE_BYTES) {
      throw new Error(`ZIP entry exceeds the ${Math.round(MAX_CU_FILE_SIZE_BYTES / 1024 / 1024)} MB limit: ${relativePath}`);
    }

    totalSize += uncompressedSize;
    if (totalSize > MAX_CU_ZIP_TOTAL_BYTES) {
      throw new Error("ZIP archive exceeds the maximum extracted size.");
    }

    if (buffer.readUInt32LE(localHeaderOffset) !== ZIP_LOCAL_SIGNATURE) {
      throw new Error(`ZIP archive is missing a local header for ${relativePath}`);
    }

    const localFilenameLength = buffer.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + localFilenameLength + localExtraLength;
    const compressedData = buffer.slice(dataStart, dataStart + compressedSize);

    const content =
      compressionMethod === 0
        ? compressedData
        : compressionMethod === 8
          ? inflateRawSync(compressedData)
          : (() => {
              throw new Error(`Unsupported ZIP compression method (${compressionMethod}) for ${relativePath}`);
            })();

    if (content.length !== uncompressedSize) {
      throw new Error(`ZIP entry size mismatch for ${relativePath}`);
    }

    entries.push({ relativePath, buffer: content });
  }

  return entries;
}

function toRecord(name: string, relativePath: string, buffer: Buffer, sourceLabel: string): CuFileRecord {
  const extension = extname(name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension) || ALLOWED_ARCHIVE_EXTENSIONS.has(extension)) {
    throw new Error(`Unsupported file type: ${name}`);
  }

  if (buffer.length > MAX_CU_FILE_SIZE_BYTES) {
    throw new Error(`${name} exceeds the ${Math.round(MAX_CU_FILE_SIZE_BYTES / 1024 / 1024)} MB file limit.`);
  }

  const safeName = sanitizeFilename(name);
  const mimeType = mimeFromName(safeName);
  const previewText = textFromBuffer(buffer, extension);
  const isText = isTextExtension(extension);

  return {
    id: randomUUID(),
    name: safeName,
    relativePath,
    extension,
    mimeType,
    size: buffer.length,
    category: detectCategory(extension),
    track: "RED",
    language: "english",
    level: 1,
    isText,
    textContent: isText ? buffer.toString("utf8") : null,
    previewText,
    contentBase64: buffer.toString("base64"),
    status: "pending",
    sourceLabel,
    error: null,
    destination: null,
  };
}

export async function filesFromFormData(formData: FormData) {
  const fileEntries = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File);

  if (fileEntries.length === 0) {
    throw new Error("Select at least one file.");
  }

  if (fileEntries.length > MAX_CU_FILES_PER_BATCH) {
    throw new Error(`A maximum of ${MAX_CU_FILES_PER_BATCH} files can be processed at once.`);
  }

  const records: CuFileRecord[] = [];

  for (const file of fileEntries) {
    const originalName = sanitizeFilename(file.name);
    const extension = extname(originalName).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      throw new Error(`Unsupported file type: ${file.name}`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (extension === ".zip") {
      for (const entry of readZipEntries(buffer)) {
        records.push(toRecord(basename(entry.relativePath), entry.relativePath, entry.buffer, `ZIP · ${originalName}`));
      }
      continue;
    }

    records.push(toRecord(originalName, originalName, buffer, "Direct upload"));
  }

  return records;
}

export const cuUploadInternals = {
  decodeXmlText,
  detectCategory,
  readZipEntries,
  sanitizeFilename,
  toRecord,
};
