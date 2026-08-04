import { loadAdaptiveLearningProgress } from "@/lib/progress";

export const AI_LEARNING_CONTEXT_SESSION_KEY = "edunancial:ai-learning-context";

export type MembershipStatus = "public" | "free" | "basic" | "premium" | "enterprise" | "beta";

export interface AILearningContext {
  pathname: string;
  track: string | null;
  level: number | null;
  lessonId: string | null;
  topic: string | null;
  language: string;
  membership: MembershipStatus;
  jurisdiction: string;
  country: string;
  progressPercent: number;
  completedLessons: string[];
  certificationPath: string | null;
  sessionStreakDays: number;
  lastContextUpdateAt: string;
}

export interface AILearningContextInput {
  pathname: string;
  language: string;
  membership: MembershipStatus;
  country: string;
  jurisdiction?: string;
}

interface ParsedCurriculumPath {
  track: string | null;
  level: number | null;
  lessonId: string | null;
}

const DEFAULT_JURISDICTION = "US";

export function parseCurriculumPath(pathname: string): ParsedCurriculumPath {
  const match = pathname.match(/^\/curriculum\/([^/]+)(?:\/(l\d+))?(?:\/([^/?#]+))?/i);

  if (!match) {
    return { track: null, level: null, lessonId: null };
  }

  const [, rawTrack, rawLevel, rawLesson] = match;

  return {
    track: rawTrack?.toUpperCase() ?? null,
    level: rawLevel ? Number(rawLevel.replace(/^l/i, "")) : null,
    lessonId: rawLesson ? rawLesson.toUpperCase() : null,
  };
}

export function deriveTopicFromLessonId(lessonId: string | null): string | null {
  if (!lessonId) {
    return null;
  }

  return lessonId
    .replace(/^[A-Z]+-L\d+-/i, "")
    .replace(/-/g, " ")
    .trim() || lessonId;
}

export function buildAILearningContext(input: AILearningContextInput): AILearningContext {
  const parsedPath = parseCurriculumPath(input.pathname);
  const adaptiveProgress = loadAdaptiveLearningProgress();
  const completedLessons = adaptiveProgress?.lessonsCompleted ?? [];
  const progressPercent = adaptiveProgress?.completionPercentage ?? 0;
  const certificationPath =
    parsedPath.track && parsedPath.level
      ? `${parsedPath.track}-L${parsedPath.level}`
      : adaptiveProgress?.currentColor && adaptiveProgress?.currentLevel
        ? `${adaptiveProgress.currentColor}-${adaptiveProgress.currentLevel}`
        : null;

  const lastLogin = adaptiveProgress?.lastLogin
    ? new Date(adaptiveProgress.lastLogin)
    : null;
  const daysSinceLastLogin =
    lastLogin && !Number.isNaN(lastLogin.getTime())
      ? Math.floor((Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  return {
    pathname: input.pathname,
    track: parsedPath.track,
    level: parsedPath.level,
    lessonId: parsedPath.lessonId,
    topic: deriveTopicFromLessonId(parsedPath.lessonId),
    language: input.language,
    membership: input.membership,
    jurisdiction: normalizeJurisdiction(input.jurisdiction ?? input.country),
    country: normalizeJurisdiction(input.country),
    progressPercent,
    completedLessons,
    certificationPath,
    sessionStreakDays: Math.max(0, 7 - daysSinceLastLogin),
    lastContextUpdateAt: new Date().toISOString(),
  };
}

export function mergeContextAcrossNavigation(
  previous: AILearningContext | null,
  current: AILearningContext,
): AILearningContext {
  if (!previous) {
    return current;
  }

  if (current.track || current.lessonId || current.level) {
    return current;
  }

  return {
    ...current,
    track: previous.track,
    level: previous.level,
    lessonId: previous.lessonId,
    topic: previous.topic,
    certificationPath: previous.certificationPath,
  };
}

export function safeLoadContextFromSessionStorage(): AILearningContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(AI_LEARNING_CONTEXT_SESSION_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as AILearningContext;
  } catch {
    return null;
  }
}

export function safeSaveContextToSessionStorage(context: AILearningContext): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(AI_LEARNING_CONTEXT_SESSION_KEY, JSON.stringify(context));
}

export function normalizeJurisdiction(value: string | null | undefined): string {
  const normalized = value?.trim().toUpperCase();

  if (!normalized) {
    return DEFAULT_JURISDICTION;
  }

  if (normalized.includes("UNITED STATES") || normalized === "USA") {
    return "US";
  }

  if (normalized.includes("CANADA")) {
    return "CA";
  }

  if (normalized.includes("MEXICO")) {
    return "MX";
  }

  if (normalized.includes("DOMINICAN")) {
    return "DO";
  }

  if (normalized.includes("UNITED KINGDOM") || normalized === "UK") {
    return "GB";
  }

  return normalized;
}
