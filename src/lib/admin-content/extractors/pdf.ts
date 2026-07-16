import { summarizeText } from "@/lib/admin-content/utils";

export function extractPdfPreview(buffer: Buffer) {
  const rawText = buffer.toString("latin1").replace(/[^\x20-\x7E\n\r]/g, " ");
  return { rawText: summarizeText(rawText, 2000), previewText: summarizeText(rawText) };
}
