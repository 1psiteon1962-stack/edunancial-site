import { extname } from "node:path";

import { slugify } from "@/lib/admin-content/utils";

export const CONTENT_DESTINATIONS = ["courses", "marketplace"] as const;
export const COURSE_TRACKS = ["red", "white", "blue"] as const;
export const COURSE_LEVELS = ["level-1", "level-2", "level-3", "level-4", "level-5"] as const;
export const PUBLICATION_STATES = ["draft", "review", "published", "archived"] as const;
export const MEMBERSHIP_ACCESS = ["free", "basic", "premium", "elite"] as const;
export const MARKETPLACE_CATEGORIES = [
  "books",
  "ebooks",
  "pdf-guides",
  "templates",
  "worksheets",
  "forms",
  "downloads",
  "zip-packages",
  "audio",
  "videos",
  "images",
  "software",
  "digital-products",
  "calculators",
  "presentations",
  "spreadsheets",
  "future-products",
] as const;
export const SUPPORTED_UPLOAD_LANGUAGES = ["en", "es", "fr", "fr-CA"] as const;

export type ContentDestination = (typeof CONTENT_DESTINATIONS)[number];
export type CourseTrack = (typeof COURSE_TRACKS)[number];
export type CourseLevel = (typeof COURSE_LEVELS)[number];
export type PublicationState = (typeof PUBLICATION_STATES)[number];
export type MembershipAccess = (typeof MEMBERSHIP_ACCESS)[number];
export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number];
export type UploadLanguage = (typeof SUPPORTED_UPLOAD_LANGUAGES)[number];

type UploadBaseConfig = {
  destination: ContentDestination;
  language: UploadLanguage;
  membershipAccess: MembershipAccess;
  publicationStatus: PublicationState;
  title: string;
  description: string;
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
};

export type CourseUploadConfig = UploadBaseConfig & {
  destination: "courses";
  track: CourseTrack;
  level: CourseLevel;
};

export type MarketplaceUploadConfig = UploadBaseConfig & {
  destination: "marketplace";
  category: MarketplaceCategory;
  associatedTrack?: CourseTrack | null;
  associatedLevel?: CourseLevel | null;
};

export type UploadConfig = CourseUploadConfig | MarketplaceUploadConfig;

function toOptionalText(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function assertOneOf<T extends readonly string[]>(value: string, allowed: T, message: string): T[number] {
  if (!allowed.includes(value)) {
    throw new Error(message);
  }
  return value as T[number];
}

export function parseUploadConfig(formData: FormData): UploadConfig {
  const destinationRaw = String(formData.get("contentDestination") ?? "").trim().toLowerCase();
  const destination = assertOneOf(
    destinationRaw,
    CONTENT_DESTINATIONS,
    "Content destination is required. Choose COURSES or MARKETPLACE.",
  );

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const language = assertOneOf(
    String(formData.get("language") ?? "en").trim(),
    SUPPORTED_UPLOAD_LANGUAGES,
    "Language is required.",
  );
  const membershipAccess = assertOneOf(
    String(formData.get("membershipAccess") ?? "free").trim(),
    MEMBERSHIP_ACCESS,
    "Membership access is required.",
  );
  const publicationStatus = assertOneOf(
    String(formData.get("publicationStatus") ?? "draft").trim(),
    PUBLICATION_STATES,
    "Publication status is required.",
  );
  const thumbnailUrl = toOptionalText(formData.get("thumbnailUrl"));
  const previewUrl = toOptionalText(formData.get("previewUrl"));

  if (!title) throw new Error("Course/Marketplace title is required.");
  if (!description) throw new Error("Course/Marketplace description is required.");

  if (destination === "courses") {
    return {
      destination,
      track: assertOneOf(
        String(formData.get("courseTrack") ?? "").trim().toLowerCase(),
        COURSE_TRACKS,
        "Course color track is required.",
      ),
      level: assertOneOf(
        String(formData.get("courseLevel") ?? "").trim().toLowerCase(),
        COURSE_LEVELS,
        "Course level is required.",
      ),
      language,
      membershipAccess,
      publicationStatus,
      title,
      description,
      thumbnailUrl,
      previewUrl,
    };
  }

  return {
    destination,
    category: assertOneOf(
      String(formData.get("marketplaceCategory") ?? "").trim().toLowerCase(),
      MARKETPLACE_CATEGORIES,
      "Marketplace category is required.",
    ),
    associatedTrack: toOptionalText(formData.get("associatedTrack")) as CourseTrack | null,
    associatedLevel: toOptionalText(formData.get("associatedLevel")) as CourseLevel | null,
    language,
    membershipAccess,
    publicationStatus,
    title,
    description,
    thumbnailUrl,
    previewUrl,
  };
}

function normalizeLanguage(language: string) {
  return language.replaceAll("-", "_").toLowerCase();
}

export function buildIntendedDestination(config: UploadConfig, filename: string, uploadId: string) {
  const extension = extname(filename).toLowerCase() || ".bin";
  const base = `${slugify(config.title)}-${uploadId.slice(-8)}`;
  const safeName = `${base}${extension}`;
  if (config.destination === "courses") {
    return `content/courses/${config.track}/${config.level}/${normalizeLanguage(config.language)}/${safeName}`;
  }
  return `content/marketplace/${config.category}/${normalizeLanguage(config.language)}/${safeName}`;
}

export function toAcademyLevel(level: CourseLevel | null) {
  return level;
}
