import { createHash } from "node:crypto";

import type { AdminContentStorage } from "@/lib/admin-content/storage/types";

/** Read-only, chunked export primitives for independent curriculum preservation. */
export const BLOB_ARCHIVE_CHUNK_BYTES = 3 * 1024 * 1024;
export const BLOB_ARCHIVE_AUDIENCE = "edunancial-curriculum-blob-archive";
export const BLOB_ARCHIVE_WORKFLOW = ".github/workflows/curriculum-blob-archive.yml";

export async function listArchiveKeys(storage: Pick<AdminContentStorage, "listWorkspaceEntries">) {
  const keys = [...new Set(await storage.listWorkspaceEntries())].sort();
  return { count: keys.length, keys, generatedAt: new Date().toISOString() };
}

export type ArchiveChunk = {
  key: string; exists: boolean; size: number; sha256: string | null;
  offset: number; length: number; done: boolean; dataBase64: string;
};

/** Preserve original accented/space-containing upload keys while refusing traversal. */
export function assertArchiveReadableKey(raw: string): string {
  const key = String(raw ?? "");
  if (!key || key.length > 1024 || key.startsWith("/") ||
      key.split("/").some((part) => part === ".." || part === ".") ||
      /[\u0000-\u001f\u007f]/u.test(key)) {
    throw new Error("Invalid archive key.");
  }
  return key;
}

/** Reads only; returns whole-object checksum with each bounded base64 chunk. */
export async function readArchiveChunk(
  storage: Pick<AdminContentStorage, "readBinary">,
  rawKey: string,
  rawOffset: number,
): Promise<ArchiveChunk> {
  const key = assertArchiveReadableKey(rawKey);
  if (!Number.isSafeInteger(rawOffset) || rawOffset < 0) throw new Error("Invalid offset.");
  const bytes = await storage.readBinary(key);
  if (!bytes) return { key, exists: false, size: 0, sha256: null, offset: 0, length: 0, done: true, dataBase64: "" };
  if (rawOffset > bytes.length) throw new Error("Offset beyond end of object.");
  const slice = bytes.subarray(rawOffset, Math.min(bytes.length, rawOffset + BLOB_ARCHIVE_CHUNK_BYTES));
  return {
    key, exists: true, size: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    offset: rawOffset, length: slice.length,
    done: rawOffset + slice.length >= bytes.length,
    dataBase64: slice.toString("base64"),
  };
}
