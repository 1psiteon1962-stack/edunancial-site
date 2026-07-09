import { GlobalPermission, type GlobalRole, hasGlobalPermission } from "@/lib/globalPermissions";

const BOOK_PATH_FRAGMENTS = ["audiobooks", "books", "certificates", "covers", "downloads", "epub", "pdf-library", "video-lessons", "videos", "webinars"];
const COURSE_PATH_FRAGMENTS = ["courses", "quizzes", "terms"];
const KPI_PATH_FRAGMENTS = [
  "campaign-analytics",
  "country-dashboard",
  "dashboard",
  "executive",
  "global-dashboard",
  "kpi",
  "language-dashboard",
  "lead-capture",
  "lead-magnets",
  "marketing",
  "pricing",
  "profit-dashboard",
  "provider",
  "regional-dashboard",
  "reports",
];
const LANGUAGE_PATH_FRAGMENTS = ["language", "languages"];
const SECURITY_PATH_FRAGMENTS = ["cybersecurity", "security"];

export function getRequiredPermissionForAdminPath(pathname: string): GlobalPermission {
  if (SECURITY_PATH_FRAGMENTS.some((fragment) => pathname.includes(fragment))) {
    return GlobalPermission.SYSTEM_ADMIN;
  }

  if (LANGUAGE_PATH_FRAGMENTS.some((fragment) => pathname.includes(fragment))) {
    return GlobalPermission.MANAGE_LANGUAGES;
  }

  if (BOOK_PATH_FRAGMENTS.some((fragment) => pathname.includes(fragment))) {
    return GlobalPermission.MANAGE_BOOKS;
  }

  if (COURSE_PATH_FRAGMENTS.some((fragment) => pathname.includes(fragment))) {
    return GlobalPermission.MANAGE_COURSES;
  }

  if (KPI_PATH_FRAGMENTS.some((fragment) => pathname.includes(fragment))) {
    return GlobalPermission.MANAGE_KPIS;
  }

  return GlobalPermission.MANAGE_USERS;
}

export function canAccessAdminPath(role: GlobalRole, pathname: string): boolean {
  return hasGlobalPermission(role, getRequiredPermissionForAdminPath(pathname));
}
