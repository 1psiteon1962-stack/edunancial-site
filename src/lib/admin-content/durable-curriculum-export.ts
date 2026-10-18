import { createHash } from "node:crypto";

import type { AdminContentStorage } from "@/lib/admin-content/storage/types";

/**
 * Q2 — read-only export of durable curriculum state for the encrypted nightly
 * archive (.github/workflows/curriculum-archive.yml).
 *
 * ARCHIVED (full content, encrypted off-site): everything a learner is served
 * from storage plus the publication ledger — published/ (atomic lessons,
 * translation packages, curriculum state), receipts/ and exports/ manifests.
 *
 * INVENTORIED (path, size, SHA-256 only): uploads/ original ZIPs. They are
 * large and re-derivable inputs; the inventory makes any loss or alteration
 * detectable without copying hundreds of megabytes into Git every night.
 *
 * This module never writes, deletes or moves anything.
 */
export const CURRICULUM_ARCHIVE_PREFIXES = ["published/", "receipts/", "exports/"] as const;
export const CURRICULUM_INVENTORY_ONLY_PREFIXES = ["uploads/"] as const;

/** Keep every response well under Netlify's 6 MB function response limit (base64 adds ~33%). */
export const MAX_EXPORT_PAGE_BYTES = 3 * 1024 * 1024;
export const MAX_EXPORT_PAGE_ENTRIES = 250;
/** A single object larger than this is reported, never silently dropped. */
export const MAX_EXPORT_OBJECT_BYTES = 4 * 1024 * 1024;

export type DurableExportEntry = {
  path: string;
  kind: "archive" | "inventory";
  size: number;
  sha256: string;
  contentBase64?: string;
  tooLarge?: true;
};

export type DurableExportPage = {
  generatedAt: string;
  totals: { archive: number; inventory: number; all: number };
  cursor: number;
  nextCursor: number | null;
  entries: DurableExportEntry[];
  missing: string[];
};

export function classifyDurablePaths(keys: readonly string[]): { archive: string[]; inventory: string[] } {
  const unique = [...new Set(keys.map((key) => key.replace(/^\/+/u, "")))].sort();
  return {
    archive: unique.filter((key) => CURRICULUM_ARCHIVE_PREFIXES.some((prefix) => key.startsWith(prefix))),
    inventory: unique.filter((key) => CURRICULUM_INVENTORY_ONLY_PREFIXES.some((prefix) => key.startsWith(prefix))),
  };
}

export async function readDurableExportPage(
  storage: Pick<AdminContentStorage, "listWorkspaceEntries" | "readBinary">,
  options: { cursor?: number; includeContent?: boolean; maxBytes?: number; maxEntries?: number; now?: () => Date } = {},
): Promise<DurableExportPage> {
  const { archive, inventory } = classifyDurablePaths(await storage.listWorkspaceEntries());
  const ordered: Array<{ path: string; kind: DurableExportEntry["kind"] }> = [
    ...archive.map((path) => ({ path, kind: "archive" as const })),
    ...inventory.map((path) => ({ path, kind: "inventory" as const })),
  ];
  const cursor = Math.max(0, Math.floor(options.cursor ?? 0));
  const includeContent = options.includeContent !== false;
  const maxBytes = options.maxBytes ?? MAX_EXPORT_PAGE_BYTES;
  const maxEntries = options.maxEntries ?? MAX_EXPORT_PAGE_ENTRIES;

  const entries: DurableExportEntry[] = [];
  const missing: string[] = [];
  let bytes = 0;
  let index = cursor;
  for (; index < ordered.length && entries.length + missing.length < maxEntries; index += 1) {
    const { path, kind } = ordered[index];
    const content = await storage.readBinary(path);
    if (!content) {
      // Listed but unreadable: report it so the archive job can fail loudly.
      missing.push(path);
      continue;
    }
    const entry: DurableExportEntry = { path, kind, size: content.length, sha256: createHash("sha256").update(content).digest("hex") };
    if (includeContent && kind === "archive") {
      if (content.length > MAX_EXPORT_OBJECT_BYTES) {
        entry.tooLarge = true;
      } else {
        // Always make progress: the first object on a page is included even if large.
        if (entries.length > 0 && bytes + content.length > maxBytes) break;
        entry.contentBase64 = content.toString("base64");
        bytes += content.length;
      }
    }
    entries.push(entry);
  }

  return {
    generatedAt: (options.now ?? (() => new Date()))().toISOString(),
    totals: { archive: archive.length, inventory: inventory.length, all: ordered.length },
    cursor,
    nextCursor: index < ordered.length ? index : null,
    entries,
    missing,
  };
}
