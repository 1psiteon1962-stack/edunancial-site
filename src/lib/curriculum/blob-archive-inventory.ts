import { createHash } from "node:crypto";

export type ArchiveReadStorage = {
  listWorkspaceEntries(): Promise<string[]>;
  readBinary(path: string): Promise<Buffer | null>;
};

export type ArchiveInventoryRecord = {
  key: string;
  size: number;
  sha256: string;
};

export function isSafeArchiveKey(key: string): boolean {
  return Boolean(key) && !key.startsWith("/") &&
    !key.split("/").some((part) => part === ".." || part === ".") &&
    !/[\\x00-\\x1f\\x7f]/u.test(key);
}

/** Read-only, complete byte inventory; fails closed on missing or changing data. */
export async function inventoryArchiveBytes(storage: ArchiveReadStorage): Promise<ArchiveInventoryRecord[]> {
  const keys = await storage.listWorkspaceEntries();
  const unique = [...new Set(keys)].sort();
  const records: ArchiveInventoryRecord[] = [];
  for (const key of unique) {
    if (!isSafeArchiveKey(key)) throw new Error("Invalid archive key.");
    const bytes = await storage.readBinary(key);
    if (bytes === null) throw new Error("Archive object disappeared while enumerating.");
    records.push({ key, size: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
  }
  return records;
}
