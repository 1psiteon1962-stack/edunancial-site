import type { UploadDestination } from "@/lib/admin-content/types";

export const UPLOAD_DESTINATIONS: UploadDestination[] = ["marketplace", "courses", "library", "blog", "news", "resources"];

export function isUploadDestination(value: string): value is UploadDestination {
  return UPLOAD_DESTINATIONS.includes(value as UploadDestination);
}
