import type { ConflictStatus, ExtractedFile, UploadBatchStatus } from "@/lib/admin-content/types";

export function deriveBatchStatus(files: ExtractedFile[]): UploadBatchStatus {
  if (files.length === 0) {
    return "failed";
  }

  const approved = files.filter((file) => file.reviewStatus === "approved").length;
  const rejected = files.filter((file) => file.reviewStatus === "rejected").length;
  const errored = files.filter((file) => file.processingStatus === "error").length;

  if (errored === files.length) {
    return "failed";
  }
  if (approved === files.length) {
    return "approved";
  }
  if (rejected === files.length) {
    return "rejected";
  }
  if (approved > 0 || rejected > 0) {
    return "partially-reviewed";
  }
  return "ready-for-review";
}

export function toDuplicateStatus(conflictStatus: ConflictStatus, extractionError: boolean) {
  if (extractionError) {
    return "extraction-error" as const;
  }
  switch (conflictStatus) {
    case "exact-duplicate":
      return "exact-duplicate" as const;
    case "probable-duplicate":
      return "probable-duplicate" as const;
    case "revision":
      return "revision" as const;
    case "destination-conflict":
    case "classification-conflict":
      return "conflict" as const;
    default:
      return "new" as const;
  }
}
