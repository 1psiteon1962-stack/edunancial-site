import { summarizeText } from "@/lib/admin-content/utils";

export function extractMarkdownPreview(buffer: Buffer) {
  const text = buffer.toString("utf8").replace(/`{1,3}[\s\S]*?`{1,3}/g, " ").replace(/[#>*_\-]+/g, " ");
  return { rawText: text, previewText: summarizeText(text) };
}
