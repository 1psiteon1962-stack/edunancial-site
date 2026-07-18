export const CU_COOKIE_NAME = "edunancial_cu_access";
export const CU_LOCAL_STORAGE_KEY = "edunancial-cu-workbench-v1";

export const CU_CATEGORY_OPTIONS = ["courses", "books", "articles", "resources", "downloads"] as const;
export const CU_TRACK_OPTIONS = ["RED", "WHITE", "BLUE"] as const;
export const CU_LANGUAGE_OPTIONS = ["english", "spanish"] as const;
export const CU_LEVEL_OPTIONS = [1, 2, 3, 4, 5] as const;

export const ALLOWED_TEXT_EXTENSIONS = new Set([".md", ".markdown", ".txt", ".html", ".htm", ".json", ".csv", ".xml"]);
export const ALLOWED_IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);
export const ALLOWED_BINARY_EXTENSIONS = new Set([".pdf", ".doc", ".docx", ...ALLOWED_IMAGE_EXTENSIONS]);
export const ALLOWED_ARCHIVE_EXTENSIONS = new Set([".zip"]);
export const ALLOWED_EXTENSIONS = new Set([
  ...ALLOWED_TEXT_EXTENSIONS,
  ...ALLOWED_BINARY_EXTENSIONS,
  ...ALLOWED_ARCHIVE_EXTENSIONS,
]);

export const CU_UPLOAD_ACCEPT = [
  ".zip",
  ".pdf",
  ".doc",
  ".docx",
  ".md",
  ".markdown",
  ".txt",
  ".html",
  ".htm",
  ".json",
  ".csv",
  ".xml",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
].join(",");

export const MAX_CU_FILE_SIZE_BYTES = 15 * 1024 * 1024;
export const MAX_CU_ZIP_TOTAL_BYTES = 75 * 1024 * 1024;
export const MAX_CU_FILES_PER_BATCH = 250;

export const MIME_BY_EXTENSION: Record<string, string> = {
  ".md": "text/markdown",
  ".markdown": "text/markdown",
  ".txt": "text/plain",
  ".html": "text/html",
  ".htm": "text/html",
  ".json": "application/json",
  ".csv": "text/csv",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".zip": "application/zip",
};
