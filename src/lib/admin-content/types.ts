export type UploadBatchStatus =
  | "uploading"
  | "processing"
  | "ready-for-review"
  | "partially-reviewed"
  | "approved"
  | "rejected"
  | "exporting"
  | "exported"
  | "failed";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type ProcessingStatus = "pending" | "extracting" | "classified" | "error";

export type ConflictStatus =
  | "none"
  | "exact-duplicate"
  | "probable-duplicate"
  | "revision"
  | "destination-conflict"
  | "classification-conflict";

export type SupportedLanguage = "en" | "es" | "fr" | "fr-CA";
export type EdunancialPillar = "red" | "white" | "blue" | "academy" | "uncategorized";
export type AcademyLevel = "level-1" | "level-2" | "level-3" | "level-4" | "level-5" | null;

export type TopLevelClassification =
  | "books"
  | "courses"
  | "lessons"
  | "quizzes"
  | "certificates"
  | "legal"
  | "membership"
  | "marketing"
  | "social-media"
  | "frequently-asked-questions"
  | "translations"
  | "audio"
  | "video"
  | "images"
  | "uncategorized";

export type TaxonomySubcategory =
  | "real-estate"
  | "tax-liens"
  | "tax-deeds"
  | "foreclosure"
  | "flipping"
  | "creative-financing"
  | "paper-assets"
  | "stocks"
  | "options"
  | "bonds"
  | "retirement"
  | "commercial-credit"
  | "business"
  | "entrepreneurship"
  | "profit"
  | "margins"
  | "artificial-intelligence"
  | "operations"
  | "general"
  | "level-1"
  | "level-2"
  | "level-3"
  | "level-4"
  | "level-5"
  | null;

export interface FileMetadataRecord {
  language: SupportedLanguage;
  region: string | null;
  title: string;
  description: string;
  source: string;
  intendedDestination: string;
  contentType: TopLevelClassification;
  pillar: EdunancialPillar;
  academyLevel: AcademyLevel;
  publicationStatus: "draft" | "approved" | "rejected";
  version: string;
  checksum: string;
  uploadBatchId: string;
}

export interface ClassificationProposal {
  category: TopLevelClassification;
  subcategory: TaxonomySubcategory;
  language: SupportedLanguage;
  academyLevel: AcademyLevel;
  destination: string;
  confidence: number;
  reasons: string[];
  pillar: EdunancialPillar;
}

export interface UploadedAsset {
  id: string;
  batchId: string;
  originalFilename: string;
  normalizedFilename: string;
  mimeType: string;
  extension: string;
  sizeBytes: number;
  checksum: string;
  isArchive: boolean;
  storagePath: string;
  createdAt: string;
  extractedFileIds: string[];
  source: string;
  notes: string;
}

export interface ExtractedFile {
  id: string;
  batchId: string;
  uploadId: string;
  originalFilename: string;
  normalizedFilename: string;
  archivePath: string | null;
  sourceArchiveFilename: string | null;
  extension: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
  processingStatus: ProcessingStatus;
  reviewStatus: ReviewStatus;
  conflictStatus: ConflictStatus;
  duplicateStatus: "new" | "exact-duplicate" | "probable-duplicate" | "revision" | "conflict" | "unsupported" | "extraction-error";
  previewText: string;
  rawText: string;
  encodedContent: string;
  classification: ClassificationProposal;
  metadata: FileMetadataRecord;
  warnings: string[];
  error: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action:
    | "login-success"
    | "login-failure"
    | "logout"
    | "batch-created"
    | "file-uploaded"
    | "archive-extracted"
    | "extraction-failure"
    | "classification-generated"
    | "classification-changed"
    | "file-approved"
    | "file-rejected"
    | "bulk-action"
    | "export-generated"
    | "github-branch-created"
    | "github-pr-opened"
    | "system-error";
  result: "success" | "failure" | "warning";
  actor: string;
  batchId?: string;
  fileId?: string;
  metadata?: Record<string, unknown>;
}

export interface ExportPackage {
  id: string;
  batchId: string;
  fileName: string;
  storagePath: string;
  manifestPath: string;
  auditSummaryPath: string;
  warningsPath: string;
  rejectedFilesPath: string;
  createdAt: string;
  validation: {
    success: boolean;
    warnings: string[];
    errors: string[];
  };
  github?: {
    branch: string;
    pullRequestUrl: string;
    pullRequestNumber: number;
  };
}

export interface UploadBatch {
  id: string;
  name: string;
  slug: string;
  source: string;
  notes: string;
  status: UploadBatchStatus;
  createdAt: string;
  updatedAt: string;
  uploads: UploadedAsset[];
  files: ExtractedFile[];
  auditHistory: AuditEvent[];
  exports: ExportPackage[];
  warnings: string[];
}

export interface BatchSummary {
  id: string;
  name: string;
  slug: string;
  source: string;
  status: UploadBatchStatus;
  createdAt: string;
  updatedAt: string;
  totalUploads: number;
  totalFiles: number;
  approvedFiles: number;
  rejectedFiles: number;
  pendingFiles: number;
  conflicts: number;
}

export type AdminRole = "owner" | "admin";

export interface AdminSession {
  email: string;
  expiresAt: number;
  csrfToken: string;
  role?: AdminRole;
}

export interface ActorContext {
  email: string;
}
