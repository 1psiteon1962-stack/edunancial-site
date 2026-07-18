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
export type UploadDestination = "marketplace" | "courses" | "library" | "blog" | "news" | "resources";

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
  destination: UploadDestination;
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
  destination: UploadDestination;
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
  destination: UploadDestination;
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

// ─── Course CMS Types ──────────────────────────────────────────────────────

export type CourseStatus = "draft" | "published" | "archived";
export type PathColor = "red" | "white" | "blue";
export type CourseAccessRole = "admin" | "content_manager" | "instructor" | "student";
export type LessonContentType =
  | "text"
  | "video"
  | "audio"
  | "pdf"
  | "docx"
  | "image"
  | "quiz"
  | "download"
  | "external-link"
  | "ai-coach";
export type MembershipTier = "free" | "basic" | "premium" | "elite";

export interface LessonBlock {
  id: string;
  type: LessonContentType;
  title: string;
  content: string;
  url: string | null;
  mediaId: string | null;
  order: number;
}

export interface AdminLesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  order: number;
  blocks: LessonBlock[];
  aiCoachPrompt: string;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminModule {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  lessons: AdminLesson[];
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CourseSeoMeta {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  keywords: string[];
  canonicalUrl: string;
}

export interface AdminCourse {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  status: CourseStatus;
  path: PathColor;
  language: SupportedLanguage;
  region: string | null;
  country: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  membershipTier: MembershipTier;
  instructorName: string;
  instructorBio: string;
  thumbnailUrl: string | null;
  tags: string[];
  categories: string[];
  prerequisites: string[];
  learningObjectives: string[];
  modules: AdminModule[];
  seo: CourseSeoMeta;
  relatedCourseIds: string[];
  relatedMarketplaceIds: string[];
  publishedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  altText: string;
  language: SupportedLanguage;
  region: string | null;
  fileType: string;
  mimeType: string;
  extension: string;
  sizeBytes: number;
  storagePath: string;
  publicUrl: string | null;
  uploadedAt: string;
  uploadedBy: string;
  associatedCourseIds: string[];
  associatedLessonIds: string[];
}

export interface ClauseImportPreview {
  course: Omit<AdminCourse, "id" | "modules" | "createdAt" | "updatedAt" | "createdBy" | "publishedAt" | "archivedAt">;
  modules: Omit<AdminModule, "id" | "lessons" | "createdAt" | "updatedAt">[];
  lessons: Omit<AdminLesson, "id" | "createdAt" | "updatedAt">[];
  validationErrors: string[];
  validationWarnings: string[];
}
