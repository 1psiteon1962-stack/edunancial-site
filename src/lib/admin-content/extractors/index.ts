import { extname } from "node:path";

import { extractCsvPreview } from "@/lib/admin-content/extractors/csv";
import { extractDocxPreview } from "@/lib/admin-content/extractors/docx";
import { extractImagePreview } from "@/lib/admin-content/extractors/image";
import { extractJsonPreview } from "@/lib/admin-content/extractors/json";
import { extractMarkdownPreview } from "@/lib/admin-content/extractors/markdown";
import { extractMediaPreview } from "@/lib/admin-content/extractors/media";
import { extractPdfPreview } from "@/lib/admin-content/extractors/pdf";
import { extractTextPreview } from "@/lib/admin-content/extractors/text";

export function extractPreview(name: string, mimeType: string, buffer: Buffer) {
  const extension = extname(name).toLowerCase();
  if (extension === ".md" || extension === ".mdx") return extractMarkdownPreview(buffer);
  if (extension === ".txt" || extension === ".svg") return extractTextPreview(buffer);
  if (extension === ".json") return extractJsonPreview(buffer);
  if (extension === ".csv") return extractCsvPreview(buffer);
  if (extension === ".docx") return extractDocxPreview(buffer);
  if (extension === ".pdf") return extractPdfPreview(buffer);
  if ([".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(extension)) return extractImagePreview(name, mimeType, buffer);
  if ([".mp3", ".wav", ".m4a", ".mp4", ".webm"].includes(extension)) return extractMediaPreview(name, mimeType, buffer);
  return extractTextPreview(buffer);
}
