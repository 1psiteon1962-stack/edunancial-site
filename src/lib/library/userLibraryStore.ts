/**
 * In-memory store for user library state.
 * In a production system these would be backed by a database.
 * The structure is designed to be easily replaced with DB calls.
 */

import type {
  UserFavorite,
  UserBookmark,
  UserProgress,
  DownloadEvent,
  UserEntitlement,
} from "./libraryTypes";

// ─── Favorites ────────────────────────────────────────────────────────────────

const favorites: UserFavorite[] = [];

export function getUserFavorites(userId: string): UserFavorite[] {
  return favorites.filter((f) => f.userId === userId);
}

export function addFavorite(userId: string, itemId: string): UserFavorite {
  const existing = favorites.find(
    (f) => f.userId === userId && f.itemId === itemId
  );
  if (existing) return existing;
  const fav: UserFavorite = { userId, itemId, addedAt: new Date().toISOString() };
  favorites.push(fav);
  return fav;
}

export function removeFavorite(userId: string, itemId: string): boolean {
  const idx = favorites.findIndex(
    (f) => f.userId === userId && f.itemId === itemId
  );
  if (idx === -1) return false;
  favorites.splice(idx, 1);
  return true;
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────

const bookmarks: UserBookmark[] = [];
let bookmarkIdCounter = 1;

export function getUserBookmarks(userId: string, itemId?: string): UserBookmark[] {
  return bookmarks.filter(
    (b) => b.userId === userId && (itemId ? b.itemId === itemId : true)
  );
}

export function upsertBookmark(
  userId: string,
  itemId: string,
  position: string,
  positionType: UserBookmark["positionType"],
  note?: string
): UserBookmark {
  const existing = bookmarks.find(
    (b) => b.userId === userId && b.itemId === itemId && b.position === position
  );
  if (existing) {
    existing.note = note;
    existing.updatedAt = new Date().toISOString();
    return existing;
  }
  const now = new Date().toISOString();
  const bm: UserBookmark = {
    id: String(bookmarkIdCounter++),
    userId,
    itemId,
    position,
    positionType,
    note,
    createdAt: now,
    updatedAt: now,
  };
  bookmarks.push(bm);
  return bm;
}

export function deleteBookmark(userId: string, bookmarkId: string): boolean {
  const idx = bookmarks.findIndex(
    (b) => b.userId === userId && b.id === bookmarkId
  );
  if (idx === -1) return false;
  bookmarks.splice(idx, 1);
  return true;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

const progressRecords: UserProgress[] = [];

export function getUserProgress(userId: string, itemId?: string): UserProgress[] {
  return progressRecords.filter(
    (p) => p.userId === userId && (itemId ? p.itemId === itemId : true)
  );
}

export function upsertProgress(
  userId: string,
  itemId: string,
  progressPercent: number,
  positionReference: string,
  timeSpentSeconds: number
): UserProgress {
  const existing = progressRecords.find(
    (p) => p.userId === userId && p.itemId === itemId
  );
  const now = new Date().toISOString();
  const completed = progressPercent >= 100;

  if (existing) {
    existing.progressPercent = Math.min(100, progressPercent);
    existing.positionReference = positionReference;
    existing.lastAccessedAt = now;
    existing.timeSpentSeconds += timeSpentSeconds;
    if (completed && !existing.completed) {
      existing.completed = true;
      existing.completedAt = now;
    }
    return existing;
  }

  const record: UserProgress = {
    userId,
    itemId,
    progressPercent: Math.min(100, progressPercent),
    positionReference,
    lastAccessedAt: now,
    completed,
    completedAt: completed ? now : undefined,
    timeSpentSeconds,
  };
  progressRecords.push(record);
  return record;
}

// ─── Download Events (DRM-ready) ──────────────────────────────────────────────

const downloadEvents: DownloadEvent[] = [];
let downloadEventIdCounter = 1;

export function recordDownload(
  userId: string,
  itemId: string,
  fileFormat: string,
  fileSizeBytes?: number,
  ipAddress?: string,
  userAgent?: string
): DownloadEvent {
  const event: DownloadEvent = {
    id: String(downloadEventIdCounter++),
    userId,
    itemId,
    downloadedAt: new Date().toISOString(),
    ipAddress,
    userAgent,
    fileFormat,
    fileSizeBytes,
    drmScheme: "none", // extensible: set to "watermark" or "full-drm" when needed
  };
  downloadEvents.push(event);
  return event;
}

export function getUserDownloads(userId: string): DownloadEvent[] {
  return downloadEvents.filter((e) => e.userId === userId);
}

export function getItemDownloadCount(itemId: string): number {
  return downloadEvents.filter((e) => e.itemId === itemId).length;
}

// ─── Entitlements ─────────────────────────────────────────────────────────────

const entitlements: UserEntitlement[] = [
  // Seed some demo entitlements for userId "demo"
  {
    userId: "demo",
    itemId: "pdf-re-terms",
    grantedVia: "free",
    grantedAt: "2024-01-01",
  },
  {
    userId: "demo",
    itemId: "pdf-budget-worksheet",
    grantedVia: "free",
    grantedAt: "2024-01-01",
  },
  {
    userId: "demo",
    itemId: "video-budgeting-101",
    grantedVia: "free",
    grantedAt: "2024-01-01",
  },
];

export function getUserEntitlements(userId: string): UserEntitlement[] {
  return entitlements.filter((e) => e.userId === userId);
}

export function isUserEntitled(userId: string, itemId: string): boolean {
  // Free items are always accessible
  return entitlements.some(
    (e) =>
      e.userId === userId &&
      e.itemId === itemId &&
      (!e.expiresAt || new Date(e.expiresAt) > new Date())
  );
}

export function grantEntitlement(
  userId: string,
  itemId: string,
  grantedVia: UserEntitlement["grantedVia"],
  purchaseOrderId?: string
): UserEntitlement {
  const existing = entitlements.find(
    (e) => e.userId === userId && e.itemId === itemId
  );
  if (existing) return existing;
  const ent: UserEntitlement = {
    userId,
    itemId,
    grantedVia,
    grantedAt: new Date().toISOString(),
    purchaseOrderId,
  };
  entitlements.push(ent);
  return ent;
}
