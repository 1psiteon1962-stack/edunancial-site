import { mergeAILearningConfig, type AILearningAdminConfig } from "./config";
import {
  normalizeJurisdiction,
  type AILearningContext,
  type MembershipStatus,
} from "./context";
import {
  generateAILearningResponse,
  type AILearningResponse,
} from "./service";

const MAX_MESSAGE_LENGTH = 4_000;
const MAX_PATH_LENGTH = 512;
const MAX_COMPLETED_LESSONS = 500;
const TRACKS = new Set([
  "RED",
  "WHITE",
  "BLUE",
  "GREEN",
  "GOLD",
  "PURPLE",
  "ORANGE",
  "BLACK",
]);
const MEMBERSHIPS = new Set<MembershipStatus>([
  "public",
  "free",
  "basic",
  "premium",
  "enterprise",
  "beta",
]);

export type AILearningPipelineStage =
  | "ingress"
  | "normalize"
  | "context"
  | "policy"
  | "orchestrate"
  | "model"
  | "postprocess";

export interface AILearningPipelineInput {
  message: string;
  context: AILearningContext;
  config?: Partial<AILearningAdminConfig>;
}

export interface AILearningPipelineResult extends AILearningResponse {
  pipeline: {
    version: "1.0";
    stages: AILearningPipelineStage[];
  };
}

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, maxLength)
    : "";
}

function normalizeTrack(value: unknown): string | null {
  const track = cleanText(value, 16).toUpperCase();
  return TRACKS.has(track) ? track : null;
}

function normalizeLevel(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const level = Math.trunc(value);
  return level >= 1 && level <= 20 ? level : null;
}

function normalizeLessonId(value: unknown): string | null {
  const lessonId = cleanText(value, 80).toUpperCase();
  return /^[A-Z0-9-]{3,80}$/.test(lessonId) ? lessonId : null;
}

function normalizeLanguage(value: unknown): string {
  const language = cleanText(value, 24).toLowerCase();
  return /^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/.test(language) ? language : "en";
}

function normalizeMembership(value: unknown): MembershipStatus {
  return MEMBERSHIPS.has(value as MembershipStatus)
    ? (value as MembershipStatus)
    : "public";
}

function normalizePercent(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizeCompletedLessons(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .slice(0, MAX_COMPLETED_LESSONS)
        .map((entry) => normalizeLessonId(entry))
        .filter((entry): entry is string => Boolean(entry)),
    ),
  );
}

export function normalizeAILearningContext(context: AILearningContext): AILearningContext {
  const track = normalizeTrack(context.track);
  const lessonId = normalizeLessonId(context.lessonId);
  const topic = cleanText(context.topic, 160) || null;
  const certificationPath = cleanText(context.certificationPath, 80) || null;
  const streak = typeof context.sessionStreakDays === "number" && Number.isFinite(context.sessionStreakDays)
    ? Math.min(365, Math.max(0, Math.trunc(context.sessionStreakDays)))
    : 0;

  return {
    pathname: cleanText(context.pathname, MAX_PATH_LENGTH) || "/",
    track,
    level: normalizeLevel(context.level),
    lessonId,
    topic,
    language: normalizeLanguage(context.language),
    membership: normalizeMembership(context.membership),
    jurisdiction: normalizeJurisdiction(cleanText(context.jurisdiction, 80)),
    country: normalizeJurisdiction(cleanText(context.country, 80)),
    progressPercent: normalizePercent(context.progressPercent),
    completedLessons: normalizeCompletedLessons(context.completedLessons),
    certificationPath,
    sessionStreakDays: streak,
    lastContextUpdateAt: cleanText(context.lastContextUpdateAt, 64) || new Date().toISOString(),
  };
}

/**
 * Canonical server-side AI learning pipeline.
 *
 * Ingress -> normalization -> learner/curriculum context -> policy/config ->
 * orchestration -> model execution -> response post-processing.
 *
 * Keeping the stages behind one entry point prevents API routes and future
 * surfaces (dashboard, lessons, assessments, mobile apps) from building their
 * own incompatible AI flows.
 */
export async function runAILearningPipeline(
  input: AILearningPipelineInput,
): Promise<AILearningPipelineResult> {
  const stages: AILearningPipelineStage[] = ["ingress"];
  const message = cleanText(input.message, MAX_MESSAGE_LENGTH);
  stages.push("normalize");

  if (!message) {
    return {
      enabled: false,
      message: "Please enter a learning question.",
      suggestions: [],
      disclaimers: [],
      milestone: null,
      contextSummary: "",
      pipeline: { version: "1.0", stages },
    };
  }

  const context = normalizeAILearningContext(input.context);
  stages.push("context");

  const config = mergeAILearningConfig(input.config);
  stages.push("policy", "orchestrate", "model");

  const response = await generateAILearningResponse({
    message,
    context,
    config,
  });
  stages.push("postprocess");

  return {
    ...response,
    suggestions: response.suggestions.slice(0, 3),
    disclaimers: Array.from(new Set(response.disclaimers)),
    pipeline: { version: "1.0", stages },
  };
}
