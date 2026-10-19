import type { UploadReceipt } from "@/lib/admin-content/upload-receipts";

/**
 * Q5 — one honest publication status for admin screens.
 *
 * "Live"   only after the learner read-back verified the lessons (PUBLISHED and
 *          verification.learnerVisible === true).
 * "In Git" only after the export pull request has merged into main (MERGED).
 */
export type PublicationStatus = {
  live: boolean;
  inGit: boolean;
  receiptState: UploadReceipt["state"] | null;
  gitExport: UploadReceipt["githubExport"]["state"] | null;
  pullRequestUrl: string | null;
  label: string;
};

export function summarizePublicationStatus(receipt: UploadReceipt | null | undefined): PublicationStatus {
  if (!receipt) return { live: false, inGit: false, receiptState: null, gitExport: null, pullRequestUrl: null, label: "No publication receipt" };
  const live = receipt.state === "PUBLISHED" && receipt.verification?.learnerVisible === true;
  const gitExport = receipt.githubExport?.state ?? null;
  const inGit = live && gitExport === "MERGED";
  const git = inGit ? "In Git"
    : gitExport === "OPEN" ? "Git export PR open"
    : gitExport === "PENDING" ? "Git export pending"
    : gitExport === "FAILED" ? "Git export failed (will retry)"
    : "Git export not required";
  const label = live ? `Live · ${git}` : receipt.state === "FAILED" ? "Not live: publication failed" : `Not live yet (${receipt.state})`;
  return { live, inGit, receiptState: receipt.state, gitExport, pullRequestUrl: receipt.githubExport?.pullRequestUrl ?? null, label };
}

/** The receipt that belongs to a review batch: recovered batches name their source; fresh uploads point back via reviewBatchId. */
export function receiptMatchesBatch(receipt: UploadReceipt | null, batchId: string): receipt is UploadReceipt {
  return Boolean(receipt && receipt.reviewBatchId === batchId);
}
