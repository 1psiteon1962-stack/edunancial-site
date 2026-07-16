import { summarizeText } from "@/lib/admin-content/utils";

export function extractTextPreview(buffer: Buffer) {
  const text = buffer.toString("utf8");
  return { rawText: text, previewText: summarizeText(text) };
}
