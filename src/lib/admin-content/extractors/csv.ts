import { summarizeText } from "@/lib/admin-content/utils";

export function extractCsvPreview(buffer: Buffer) {
  const raw = buffer.toString("utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }
  return { rawText: raw, previewText: summarizeText(lines.slice(0, 5).join(" | ")) };
}
