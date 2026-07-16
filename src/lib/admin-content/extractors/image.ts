import { previewBinaryUpload } from "@/lib/admin-content/security";

export function extractImagePreview(name: string, mimeType: string, buffer: Buffer) {
  return { rawText: "", previewText: previewBinaryUpload(name, mimeType, buffer) };
}
