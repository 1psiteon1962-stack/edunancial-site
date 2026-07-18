import type { SupportedLanguage } from "@/lib/admin-content/types";

export const ADMIN_SESSION_COOKIE = "edunancial_admin_session";
export const ADMIN_CSRF_COOKIE = "edunancial_admin_csrf";
export const DEFAULT_STORAGE_PREFIX = "admin-content";
export const DEFAULT_STORAGE_BUCKET = "admin-content";
export const DEFAULT_BATCH_FILE_LIMIT = 500;
export const DEFAULT_MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
export const DEFAULT_MAX_BATCH_BYTES = 200 * 1024 * 1024;
export const DEFAULT_MAX_EXTRACTED_BYTES = 500 * 1024 * 1024;
export const DEFAULT_MAX_COMPRESSION_RATIO = 120;
export const DEFAULT_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
export const DEFAULT_LOGIN_RATE_LIMIT = { maxRequests: 5, windowMs: 15 * 60 * 1000 };
export const DEFAULT_UPLOAD_RATE_LIMIT = { maxRequests: 10, windowMs: 15 * 60 * 1000 };

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["en", "es", "fr", "fr-CA"];

export const ALLOWED_EXTENSIONS = new Set([
  ".txt",
  ".md",
  ".mdx",
  ".json",
  ".csv",
  ".docx",
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".mp3",
  ".wav",
  ".m4a",
  ".mp4",
  ".webm",
  ".zip",
]);

export const EXECUTABLE_EXTENSIONS = new Set([
  ".exe",
  ".dll",
  ".bat",
  ".cmd",
  ".com",
  ".sh",
  ".ps1",
  ".js",
  ".mjs",
  ".cjs",
  ".html",
  ".htm",
  ".php",
  ".py",
  ".rb",
  ".jar",
  ".apk",
  ".msi",
]);

export const EXTENSION_TO_MIME: Record<string, string[]> = {
  ".txt": ["text/plain"],
  ".md": ["text/markdown", "text/plain"],
  ".mdx": ["text/markdown", "text/plain"],
  ".json": ["application/json", "text/plain"],
  ".csv": ["text/csv", "application/csv", "text/plain"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/zip"],
  ".pdf": ["application/pdf"],
  ".png": ["image/png"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".webp": ["image/webp"],
  ".gif": ["image/gif"],
  ".svg": ["image/svg+xml", "text/plain"],
  ".mp3": ["audio/mpeg"],
  ".wav": ["audio/wav", "audio/x-wav"],
  ".m4a": ["audio/mp4"],
  ".mp4": ["video/mp4"],
  ".webm": ["video/webm"],
  ".zip": ["application/zip", "application/x-zip-compressed"],
};
