// ─── Content Types ────────────────────────────────────────────────────────────

export type LibraryItemType =
  | "book"
  | "audiobook"
  | "pdf"
  | "epub"
  | "video";

export type LibraryCategory =
  | "foundations"
  | "business"
  | "personal-finance"
  | "real-estate"
  | "investing"
  | "entrepreneurship"
  | "family-finance"
  | "teen-finance"
  | "credit-debt"
  | "wealth-building";

export type LibraryItemStatus = "published" | "draft" | "archived";

export type AccessLevel = "free" | "paid" | "membership";

// ─── Library Item ─────────────────────────────────────────────────────────────

export interface LibraryItem {
  id: string;
  type: LibraryItemType;
  title: string;
  author: string;
  description: string;
  longDescription?: string;
  categories: LibraryCategory[];
  tags: string[];
  coverImage: string;
  thumbnailImage?: string;

  // Availability
  status: LibraryItemStatus;
  accessLevel: AccessLevel;
  price?: number;
  membershipRequired?: string;

  // Media
  previewUrl?: string;       // free preview
  mediaUrl?: string;         // full content (protected)
  downloadUrl?: string;      // downloadable asset URL
  downloadable: boolean;
  fileFormat?: string;       // "epub", "pdf", "mp3", etc.
  fileSizeBytes?: number;
  durationMinutes?: number;  // for audio/video

  // Metadata
  language: string;
  publishedAt: string;       // ISO date
  updatedAt: string;
  pageCount?: number;
  narrator?: string;         // for audiobooks
  isbn?: string;
  publisher?: string;

  // Stats
  downloadCount: number;
  viewCount: number;
  averageRating?: number;
  ratingCount?: number;
}

// ─── User Library State ───────────────────────────────────────────────────────

export interface UserFavorite {
  userId: string;
  itemId: string;
  addedAt: string;
}

export interface UserBookmark {
  id: string;
  userId: string;
  itemId: string;
  position: string;          // page number, timestamp, or chapter reference
  positionType: "page" | "timestamp" | "chapter" | "percentage";
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  userId: string;
  itemId: string;
  progressPercent: number;   // 0–100
  positionReference: string; // page / timestamp / chapter
  lastAccessedAt: string;
  completed: boolean;
  completedAt?: string;
  timeSpentSeconds: number;
}

// ─── Download Tracking (DRM-ready) ───────────────────────────────────────────

export interface DownloadEvent {
  id: string;
  userId: string;
  itemId: string;
  downloadedAt: string;
  ipAddress?: string;
  userAgent?: string;
  fileFormat: string;
  fileSizeBytes?: number;

  // DRM readiness
  licenseToken?: string;      // future: signed token for DRM enforcement
  expiresAt?: string;         // future: token expiry
  deviceFingerprint?: string; // future: device-binding
  drmScheme?: "none" | "watermark" | "full-drm"; // extensible
}

// ─── Entitlement ──────────────────────────────────────────────────────────────

export interface UserEntitlement {
  userId: string;
  itemId: string;
  grantedVia: "purchase" | "membership" | "free" | "admin";
  grantedAt: string;
  expiresAt?: string;
  purchaseOrderId?: string;
}

// ─── Admin / CRUD ─────────────────────────────────────────────────────────────

export interface LibraryItemFormData {
  type: LibraryItemType;
  title: string;
  author: string;
  description: string;
  longDescription: string;
  categories: LibraryCategory[];
  tags: string;
  coverImage: string;
  status: LibraryItemStatus;
  accessLevel: AccessLevel;
  price: string;
  downloadable: boolean;
  fileFormat: string;
  mediaUrl: string;
  downloadUrl: string;
  previewUrl: string;
  language: string;
  durationMinutes: string;
  pageCount: string;
  narrator: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface LibrarySearchParams {
  q?: string;
  type?: LibraryItemType | "";
  category?: LibraryCategory | "";
  accessLevel?: AccessLevel | "";
  page?: number;
  perPage?: number;
}

export interface LibrarySearchResult {
  items: LibraryItem[];
  total: number;
  page: number;
  perPage: number;
}
