import { previewBinaryUpload } from "@/lib/admin-content/security";

export function extractMediaPreview(name: string, mimeType: string, buffer: Buffer) {
  return { rawText: "", previewText: previewBinaryUpload(name, mimeType, buffer) };
}
