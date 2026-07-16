// ─────────────────────────────────────────────────────────────
// Global Video Learning Architecture
// Canonical types for all Edunancial video learning content.
//
// GLOBAL STANDARD: This file is the single source of truth for
// video learning types across all regional Edunancial websites.
// Only language, regional examples, and country-specific
// resources should differ per region — the type structure
// remains identical worldwide.
// ─────────────────────────────────────────────────────────────

// ── Video Provider ───────────────────────────────────────────

/**
 * Supported video providers.
 * Design allows future providers without structural redesign.
 */
export type VideoProvider =
  | "youtube"       // Official Edunancial YouTube channel (primary)
  | "vimeo"         // Future: Vimeo hosting
  | "enterprise"    // Future: Enterprise video hosting (Kaltura, Brightcove, etc.)
  | "live_webinar"  // Future: Live webinars (Zoom, BigMarker, etc.)
  | "live_classroom"// Future: Live virtual classroom
  | "conference"    // Future: Recorded conference sessions
  | "premium"       // Future: Member-only premium video library
  | "uploaded";     // Direct file upload (fallback)

/**
 * Delivery mode for a video lesson.
 */
export type VideoDeliveryMode =
  | "on_demand"     // Pre-recorded, watch anytime
  | "live"          // Happening right now
  | "scheduled"     // Upcoming live event
  | "replay";       // Archived live event

// ── Video Configuration ──────────────────────────────────────

/**
 * Provider-agnostic video configuration.
 * Store the source URL — the VideoPlayer component resolves
 * the embed URL at render time using provider-specific utilities.
 */
export interface VideoConfig {
  provider: VideoProvider;
  /** Raw source URL (e.g. https://www.youtube.com/watch?v=ABC) */
  sourceUrl: string;
  /** Override embed URL when auto-generation is not possible */
  embedUrlOverride?: string;
  /** Direct thumbnail URL */
  thumbnailUrl?: string;
  /** Duration label, e.g. "8 min" */
  duration?: string;
  /** Duration in seconds for progress tracking */
  durationSeconds?: number;
  /** Delivery mode */
  deliveryMode?: VideoDeliveryMode;
  /** Scheduled date/time for live events */
  scheduledAt?: string;
  /** Whether closed captions are available */
  closedCaptionsAvailable?: boolean;
  /** Language of the video audio track */
  language?: string;
}

// ── Lesson Resource ──────────────────────────────────────────

export type LessonResourceType =
  | "workbook"
  | "checklist"
  | "template"
  | "guide"
  | "spreadsheet"
  | "case_study"
  | "reference"
  | "external_link";

export interface LessonResource {
  id: string;
  type: LessonResourceType;
  label: string;
  /** Relative path or absolute URL */
  url: string;
  /** File size label, e.g. "1.2 MB" */
  fileSize?: string;
  /** File format label, e.g. "PDF", "XLSX" */
  format?: string;
  /** Whether this resource is free or premium */
  isPremium?: boolean;
  description?: string;
}

// ── Key Definition ───────────────────────────────────────────

export interface KeyDefinition {
  term: string;
  definition: string;
  /** Optional example sentence or context */
  example?: string;
}

// ── Reflection Question ──────────────────────────────────────

export interface ReflectionQuestion {
  id: string;
  question: string;
  /** Hint or prompt to guide the learner's thinking */
  hint?: string;
}

// ── AI Coach Configuration ───────────────────────────────────

/**
 * Configures the post-lesson AI Coach experience.
 *
 * The AI Coach reinforces lessons through Socratic questioning.
 * It MUST include guardrail messaging and MUST NOT make
 * financial, legal, tax, or investment decisions for members.
 */
export interface AICoachConfig {
  /**
   * 3–5 Socratic questions the AI uses to reinforce this lesson.
   * The AI may generate additional questions dynamically.
   */
  socratiсQuestions?: string[];
  /** Custom system prompt context for the AI for this lesson */
  systemPromptContext?: string;
  /** Lesson IDs to recommend after this lesson */
  recommendedLessonIds?: string[];
  /** Whether the AI coach is enabled for this lesson */
  enabled?: boolean;
}

// ── Quiz Types ───────────────────────────────────────────────
// (Re-exported from course-platform for use in lesson pages)

export interface LessonQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonQuizConfig {
  id: string;
  title: string;
  passingScore: number;
  questions: LessonQuizQuestion[];
}

// ── Progress ─────────────────────────────────────────────────

export type CompletionStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "passed"      // Completed quiz with passing score
  | "failed";     // Completed quiz below passing score

export interface LessonProgress {
  lessonId: string;
  userId: string;
  status: CompletionStatus;
  videoSecondsWatched?: number;
  videoCompleted?: boolean;
  quizScore?: number;
  completedAt?: string;
  lastAccessedAt?: string;
}

// ── Publication ──────────────────────────────────────────────

export type PublicationStatus = "draft" | "published" | "archived";

// ── Extended Lesson Type ─────────────────────────────────────

/**
 * GlobalLesson is the canonical lesson type used across all
 * Edunancial regional websites.
 *
 * It extends the base Lesson type in course-platform.ts with
 * all fields required by the global video learning architecture.
 *
 * Only language/region fields should vary per regional site.
 * All structural fields remain identical worldwide.
 */
export interface GlobalLesson {
  // ── Identity ────────────────────────────────────────────
  id: string;
  courseId: string;
  /** Lesson number within the course (1-based) */
  order: number;
  title: string;
  /** Short summary shown below the video */
  description: string;
  /** Estimated total completion time including activities */
  estimatedMinutes?: number;

  // ── Video ────────────────────────────────────────────────
  video: VideoConfig;

  // ── Educational Content ──────────────────────────────────
  /** What the learner will be able to do after this lesson */
  objectives?: string[];
  /** Key terms and definitions introduced in this lesson */
  definitions?: KeyDefinition[];
  /** Full lesson notes / summary text */
  notes?: string;
  /** Full video transcript */
  transcript?: string;

  // ── Downloads & Resources ────────────────────────────────
  resources?: LessonResource[];

  // ── Reflection ───────────────────────────────────────────
  reflectionQuestions?: ReflectionQuestion[];

  // ── AI Coach ─────────────────────────────────────────────
  aiCoach?: AICoachConfig;

  // ── Assessment ───────────────────────────────────────────
  quizId?: string;

  // ── Navigation ───────────────────────────────────────────
  /** Lesson IDs that should be completed before this one */
  prerequisites?: string[];
  /** Suggested next lesson ID after completion */
  suggestedNextLessonId?: string;

  // ── Localization ─────────────────────────────────────────
  /** Language of this lesson content (BCP 47 code, default: 'en') */
  language?: string;
  /** Region this lesson targets (default: 'global') */
  region?: string;
  /** Instructor override at lesson level */
  instructorId?: string;

  // ── Administration ───────────────────────────────────────
  publicationStatus?: PublicationStatus;
  /** Semantic version string, e.g. "1.0.0" */
  version?: string;
  /** ISO date of last content update */
  lastUpdatedAt?: string;
  isPremium?: boolean;
}

// ── Content Upload Portal Fields ─────────────────────────────

/**
 * Mirrors all fields in the Content Upload Portal (CMS admin).
 * Administrators paste this data to publish a lesson.
 */
export interface ContentUploadPortalFields {
  courseTitle: string;
  lessonNumber: number;
  youtubeUrl: string;
  videoLength: string;
  language: string;
  instructor: string;
  transcript: string;
  closedCaptionAvailability: boolean;
  workbookFile: string;
  downloads: string[];
  quiz: LessonQuizConfig | null;
  aiPromptSet: string[];
  relatedLessons: string[];
  prerequisites: string[];
  completionStatus: CompletionStatus;
  publicationStatus: PublicationStatus;
  versionHistory: Array<{
    version: string;
    date: string;
    notes: string;
  }>;
}

// ── Regional Course Config ───────────────────────────────────

/**
 * Per-region overrides for a course or lesson.
 * The base course structure is global; only these fields differ.
 */
export interface RegionalCourseOverride {
  region: string;
  language: string;
  /** Region-specific legal disclaimer */
  legalDisclaimer?: string;
  /** Region-specific examples to substitute */
  regionalExamples?: string[];
  /** Country-specific resource links */
  countryResources?: LessonResource[];
  /** Regional pricing (USD equivalent) */
  localPriceLabel?: string;
}
