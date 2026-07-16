import { summarizeText } from "@/lib/admin-content/utils";

export function extractJsonPreview(buffer: Buffer) {
  const raw = buffer.toString("utf8");
  const parsed = JSON.parse(raw) as unknown;
  return { rawText: raw, previewText: summarizeText(JSON.stringify(parsed, null, 2)) };
}
