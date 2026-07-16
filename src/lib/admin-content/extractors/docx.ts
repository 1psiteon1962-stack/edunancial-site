import { extractZipEntries } from "@/lib/admin-content/security";
import { summarizeText } from "@/lib/admin-content/utils";

export function extractDocxPreview(buffer: Buffer) {
  const documentXml = extractZipEntries(buffer).find((entry) => entry.name === "word/document.xml");
  if (!documentXml) {
    throw new Error("DOCX document.xml entry not found");
  }
  const rawText = documentXml.data
    .toString("utf8")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { rawText, previewText: summarizeText(rawText) };
}
