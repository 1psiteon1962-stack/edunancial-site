import { extname } from "node:path";
import { COURSE_LEVELS, COURSE_TRACKS, SUPPORTED_UPLOAD_LANGUAGES } from "@/lib/admin-content/constants";
import type { CourseTrack } from "@/lib/admin-content/constants";

export const PRACTICE_CONTENT_TYPES = ["flashcards"] as const;
export type PracticeContentType = (typeof PRACTICE_CONTENT_TYPES)[number];
export type PracticeLevel = (typeof COURSE_LEVELS)[number];

export type PracticeUploadConfig = {
  destination: "practice";
  contentType: "flashcards";
  track: CourseTrack;
  level: PracticeLevel;
  language: (typeof SUPPORTED_UPLOAD_LANGUAGES)[number];
  membershipAccess: "basic" | "pro" | "gold";
  title: string;
  description: string;
};

export function validatePracticeUpload(config: PracticeUploadConfig) {
  if (!COURSE_TRACKS.includes(config.track)) throw new Error("Flashcard color track is required.");
  if (!COURSE_LEVELS.includes(config.level)) throw new Error("Flashcard level is required.");
  if (!SUPPORTED_UPLOAD_LANGUAGES.includes(config.language)) throw new Error("Flashcard language is required.");
  if (!config.title.trim()) throw new Error("Flashcard deck title is required.");
  if (!config.description.trim()) throw new Error("Flashcard deck description is required.");
  return config;
}

export function buildPracticeFlashcardDestination(config: PracticeUploadConfig, filename: string) {
  validatePracticeUpload(config);
  const extension = extname(filename).toLowerCase() || ".bin";
  const safeStem = filename.slice(0, filename.length - extension.length).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const locale = config.language.toLowerCase().replaceAll("-", "_");
  return `content/practice/flashcards/${config.track}/${config.level}/${locale}/${safeStem}${extension}`;
}
