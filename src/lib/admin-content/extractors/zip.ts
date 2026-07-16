import { extractZipEntries } from "@/lib/admin-content/security";

export function extractArchiveEntries(buffer: Buffer) {
  return extractZipEntries(buffer);
}
