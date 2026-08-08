import type { BatchSummary, ExtractedFile } from "@/lib/admin-content/types";

export function toggleSelectionItem(selectedIds: string[], id: string, checked: boolean) {
  const next = new Set(selectedIds);
  if (checked) {
    next.add(id);
  } else {
    next.delete(id);
  }
  return [...next];
}

export function replaceVisibleSelection(selectedIds: string[], visibleIds: string[], checked: boolean) {
  const next = new Set(selectedIds);
  for (const id of visibleIds) {
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
  }
  return [...next];
}

export function pruneSelection(selectedIds: string[], allowedIds: string[]) {
  const allowed = new Set(allowedIds);
  return selectedIds.filter((id) => allowed.has(id));
}

export function getVisibleSelectionState(selectedIds: string[], visibleIds: string[]) {
  const visible = new Set(visibleIds);
  const selectedVisible = selectedIds.filter((id) => visible.has(id)).length;
  return {
    selectedVisible,
    totalVisible: visibleIds.length,
    allVisibleSelected: visibleIds.length > 0 && selectedVisible === visibleIds.length,
    someVisibleSelected: selectedVisible > 0 && selectedVisible < visibleIds.length,
  };
}

export function summarizeSelectedBatches(batches: BatchSummary[]) {
  return {
    batchCount: batches.length,
    totalFiles: batches.reduce((sum, batch) => sum + batch.totalFiles, 0),
    exportedBatches: batches.filter((batch) => batch.status === "exported").length,
    failedBatches: batches.filter((batch) => batch.status === "failed").length,
    conflicts: batches.reduce((sum, batch) => sum + batch.conflicts, 0),
  };
}

export function summarizeSelectedFiles(files: ExtractedFile[]) {
  return {
    fileCount: files.length,
    approvedFiles: files.filter((file) => file.reviewStatus === "approved").length,
    pendingFiles: files.filter((file) => file.reviewStatus === "pending").length,
    rejectedFiles: files.filter((file) => file.reviewStatus === "rejected").length,
    conflicts: files.filter((file) => file.conflictStatus !== "none").length,
  };
}
