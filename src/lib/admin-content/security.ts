import { extname, normalize, sep } from "node:path";
import { inflateRawSync } from "node:zlib";

import {
  ALLOWED_EXTENSIONS,
  DEFAULT_BATCH_FILE_LIMIT,
  DEFAULT_MAX_BATCH_BYTES,
  DEFAULT_MAX_COMPRESSION_RATIO,
  DEFAULT_MAX_EXTRACTED_BYTES,
  DEFAULT_MAX_UPLOAD_BYTES,
  EXECUTABLE_EXTENSIONS,
  EXTENSION_TO_MIME,
} from "@/lib/admin-content/config";
import { sha256, slugify, summarizeText } from "@/lib/admin-content/utils";

const SIG_LOCAL = 0x04034b50;
const SIG_CD = 0x02014b50;
const SIG_EOCD = 0x06054b50;

export type ZipEntryRecord = {
  name: string;
  normalizedName: string;
  data: Buffer;
  size: number;
  compressedSize: number;
};

export function normalizeUploadFilename(name: string) {
  const raw = name.replaceAll("\\", " ").replaceAll("/", " ").trim() || "upload";
  const extension = extname(raw).toLowerCase();
  const stem = raw.slice(0, raw.length - extension.length) || "upload";
  const normalizedStem = slugify(stem).replace(/^-+|-+$/g, "") || "upload";
  return `${normalizedStem}${extension}`;
}

export function assertValidUploadName(name: string) {
  const normalized = name.replaceAll("\\", "/");
  if (
    normalized.startsWith("/") ||
    /^[a-zA-Z]:\//.test(normalized) ||
    normalized.includes("../") ||
    normalized.includes("..\\")
  ) {
    throw new Error(`Unsafe filename: ${name}`);
  }
  return normalizeUploadFilename(name);
}

export function detectMimeType(buffer: Buffer, fallback = "application/octet-stream") {
  if (buffer.length >= 4 && buffer.slice(0, 4).toString("hex") === "25504446") return "application/pdf";
  if (buffer.length >= 8 && buffer.slice(0, 8).toString("hex") === "89504e470d0a1a0a") return "image/png";
  if (buffer.length >= 3 && buffer.slice(0, 3).toString("hex") === "ffd8ff") return "image/jpeg";
  if (buffer.length >= 12 && buffer.slice(8, 12).toString("ascii") === "WEBP") return "image/webp";
  if (buffer.length >= 6 && ["GIF87a", "GIF89a"].includes(buffer.slice(0, 6).toString("ascii"))) return "image/gif";
  if (buffer.length >= 4 && buffer.slice(0, 4).toString("hex") === "504b0304") return "application/zip";
  if (buffer.length >= 3 && buffer.slice(0, 3).toString("hex") === "494433") return "audio/mpeg";
  if (buffer.length >= 12 && buffer.slice(0, 4).toString("ascii") === "RIFF" && buffer.slice(8, 12).toString("ascii") === "WAVE") return "audio/wav";
  if (buffer.length >= 12 && buffer.slice(4, 8).toString("ascii") === "ftyp") {
    const brand = buffer.slice(8, 12).toString("ascii");
    if (brand.startsWith("M4A")) return "audio/mp4";
    return "video/mp4";
  }
  if (buffer.length >= 4 && buffer.slice(0, 4).toString("hex") === "1a45dfa3") return "video/webm";
  return fallback;
}

export function validateFileType(name: string, mimeType: string, buffer: Buffer) {
  const safeName = assertValidUploadName(name);
  const extension = extname(safeName).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error(`Unsupported file extension: ${extension}`);
  }
  if (EXECUTABLE_EXTENSIONS.has(extension)) {
    throw new Error(`Executable uploads are not allowed: ${extension}`);
  }

  const detectedMime = detectMimeType(buffer, mimeType || "application/octet-stream");
  const allowedMimes = EXTENSION_TO_MIME[extension] ?? [];
  const looksText = [".txt", ".md", ".mdx", ".json", ".csv", ".svg"].includes(extension);
  if (!looksText && allowedMimes.length > 0 && !allowedMimes.includes(detectedMime)) {
    throw new Error(`MIME type ${detectedMime} does not match ${extension}`);
  }

  return { safeName, extension, detectedMime };
}

export function validateBatchSize(totalBytes: number) {
  if (totalBytes > DEFAULT_MAX_BATCH_BYTES) {
    throw new Error(`Upload batch exceeds ${DEFAULT_MAX_BATCH_BYTES} bytes`);
  }
}

export function validateFileSize(fileSize: number) {
  if (fileSize > DEFAULT_MAX_UPLOAD_BYTES) {
    throw new Error(`Upload exceeds ${DEFAULT_MAX_UPLOAD_BYTES} bytes`);
  }
}

export function extractZipEntries(buffer: Buffer) {
  let eocdOffset = -1;
  for (let index = buffer.length - 22; index >= 0; index -= 1) {
    if (buffer.readUInt32LE(index) === SIG_EOCD) {
      eocdOffset = index;
      break;
    }
  }
  if (eocdOffset < 0) throw new Error("Invalid ZIP: End of Central Directory record not found");

  const cdOffset = buffer.readUInt32LE(eocdOffset + 16);
  const numEntries = buffer.readUInt16LE(eocdOffset + 8);
  if (numEntries === 0) throw new Error("ZIP archive is empty");
  if (numEntries > DEFAULT_BATCH_FILE_LIMIT) throw new Error(`ZIP contains too many files (${numEntries})`);

  const entries: ZipEntryRecord[] = [];
  const seen = new Set<string>();
  let totalSize = 0;
  let pos = cdOffset;

  for (let index = 0; index < numEntries; index += 1) {
    if (buffer.readUInt32LE(pos) !== SIG_CD) {
      throw new Error(`Invalid ZIP central directory signature at ${pos}`);
    }

    const bitFlag = buffer.readUInt16LE(pos + 8);
    if ((bitFlag & 0x1) === 0x1) {
      throw new Error("Password-protected ZIP files are not supported");
    }

    const compressionMethod = buffer.readUInt16LE(pos + 10);
    const compressedSize = buffer.readUInt32LE(pos + 20);
    const uncompressedSize = buffer.readUInt32LE(pos + 24);
    const filenameLen = buffer.readUInt16LE(pos + 28);
    const extraLen = buffer.readUInt16LE(pos + 30);
    const commentLen = buffer.readUInt16LE(pos + 32);
    const externalAttrs = buffer.readUInt32LE(pos + 38);
    const localOffset = buffer.readUInt32LE(pos + 42);
    const name = buffer.slice(pos + 46, pos + 46 + filenameLen).toString("utf8");
    pos += 46 + filenameLen + extraLen + commentLen;

    if (!name || name.endsWith("/") || name.endsWith("\\")) continue;
    if ((externalAttrs >>> 16 & 0o170000) === 0o120000) {
      throw new Error(`ZIP symlink entries are not allowed: ${name}`);
    }

    const normalized = normalize(name.replaceAll("\\", "/"));
    if (
      normalized.startsWith("..") ||
      normalized.includes(`..${sep}`) ||
      normalized.startsWith("/") ||
      /^[a-zA-Z]:/.test(normalized)
    ) {
      throw new Error(`ZIP path traversal detected: ${name}`);
    }
    if (normalized.split("/").length > 16) {
      throw new Error(`ZIP entry path is too deep: ${name}`);
    }
    if (seen.has(normalized)) {
      throw new Error(`ZIP contains duplicate filenames: ${normalized}`);
    }
    seen.add(normalized);

    const extension = extname(normalized).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension) || EXECUTABLE_EXTENSIONS.has(extension)) {
      throw new Error(`ZIP entry type is not allowed: ${name}`);
    }

    totalSize += uncompressedSize;
    if (totalSize > DEFAULT_MAX_EXTRACTED_BYTES) {
      throw new Error(`ZIP extracted contents exceed ${DEFAULT_MAX_EXTRACTED_BYTES} bytes`);
    }
    if (compressedSize > 0 && uncompressedSize / compressedSize > DEFAULT_MAX_COMPRESSION_RATIO) {
      throw new Error(`ZIP entry compression ratio is too high: ${name}`);
    }

    if (buffer.readUInt32LE(localOffset) !== SIG_LOCAL) {
      throw new Error(`Invalid ZIP local header for ${name}`);
    }
    const localFilenameLen = buffer.readUInt16LE(localOffset + 26);
    const localExtraLen = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localFilenameLen + localExtraLen;
    const compressedData = buffer.slice(dataStart, dataStart + compressedSize);
    let data: Buffer;
    if (compressionMethod === 0) {
      data = compressedData;
    } else if (compressionMethod === 8) {
      data = inflateRawSync(compressedData);
    } else {
      throw new Error(`Unsupported ZIP compression method: ${compressionMethod}`);
    }

    entries.push({
      name,
      normalizedName: normalizeUploadFilename(normalized),
      data,
      size: uncompressedSize,
      compressedSize,
    });
  }

  return entries;
}

export function verifyDestinationPath(destination: string) {
  const normalized = destination.replaceAll("\\", "/").replace(/^\/+/, "");
  const allowedPrefixes = ["content/", "curriculum/", "data/", "assets/"];
  if (!allowedPrefixes.some((prefix) => normalized.startsWith(prefix))) {
    throw new Error(`Destination path is outside approved roots: ${destination}`);
  }
  if (normalized.includes("../") || normalized.includes("..\\") || normalized.startsWith("/")) {
    throw new Error(`Destination path is unsafe: ${destination}`);
  }
  return normalized;
}

export function previewBinaryUpload(name: string, mimeType: string, buffer: Buffer) {
  return summarizeText(`${name} (${mimeType}) - ${buffer.length} bytes`);
}

export function checksumText(value: string) {
  return sha256(Buffer.from(value, "utf8"));
}
