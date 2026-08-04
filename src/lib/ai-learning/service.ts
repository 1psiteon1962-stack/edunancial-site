import { readFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";

import { evaluateCoachRequest } from "@/lib/ai/guardrails";

import {
  canUseAILearningLesson,
  canUseAILearningTrack,
  mergeAILearningConfig,
  type AILearningAdminConfig,
} from "./config";
import type { AILearningContext } from "./context";

export interface AILearningRequest {
  message: string;
  context: AILearningContext;
  config?: Partial<AILearningAdminConfig>;
}

export interface AILearningResponse {
  message: string;
  suggestions: string[];
  disclaimers: string[];
  milestone: string | null;
  contextSummary: string;
  enabled: boolean;
}

const EDUCATIONAL_DISCLAIMER =
  "Educational content only — not individualized legal, tax, accounting, investment, estate planning, or financial planning advice.";

const SENSITIVE_TOPIC_PATTERN = /(law|legal|tax|taxes|investment|invest|accounting|estate|financial planning)/i;
const INVESTMENT_REQUEST_PATTERN = /(which stock|what should i buy|specific investment|pick a crypto|buy this stock)/i;

const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_MAX_TOKENS = 1200;

const TRACK_DISPLAY_NAMES: Record<string, string> = {
  RED: "Red Academy (Business & Entrepreneurship)",
  WHITE: "White Academy (Paper Assets & Investing)",
  BLUE: "Blue Academy (Real Estate & Advanced Wealth)",
};

interface ParsedAIResponse {
  message: string;
  suggestions: string[];
  disclaimers: string[];
  milestone: string | null;
}

function loadLessonObjectives(
  track: string | null,
  level: number | null,
  lessonId: string | null,
): string {
  if (!track || !level || !lessonId) return "";

  // Validate all path components against strict allowlists before constructing
  // the filesystem path, preventing path-traversal/injection attacks.
  if (!/^[A-Z]{2,10}$/.test(track.toUpperCase())) return "";
  if (!Number.isInteger(level) || level < 1 || level > 20) return "";
  if (!/^[A-Z0-9-]{3,30}$/.test(lessonId.toUpperCase())) return "";

  try {
    const curriculumBase = resolve(process.cwd(), "content", "curriculum");
    const filePath = join(
      curriculumBase,
      track.toUpperCase(),
      `L${level}`,
      `${lessonId.toUpperCase()}.md`,
    );

    // Confirm the resolved path is still inside the curriculum directory.
    if (!filePath.startsWith(curriculumBase + sep)) return "";

    const content = readFileSync(filePath, "utf8");

    const objectivesMatch = content.match(
      /## Learning Objectives\n([\s\S]*?)(?=\n##|\n---|\s*$)/,
    );
    if (objectivesMatch) {
      return objectivesMatch[1].trim();
    }

    const titleMatch = content.match(/^title:\s*(.+)$/m);
    return titleMatch ? `Lesson: ${titleMatch[1].trim()}` : "";
  } catch {
    return "";
  }
}

function buildSystemPrompt(context: AILearningContext, lessonObjectives: string): string {
  const trackDescription = context.track
    ? (TRACK_DISPLAY_NAMES[context.track] ?? context.track)
    : "General";

  const levelInfo = context.level ? `Level ${context.level}` : "General";
  const lessonInfo = [context.lessonId, context.topic].filter(Boolean).join(" — ");

  const progressParts = [
    `${context.progressPercent}% of curriculum complete`,
    `${context.completedLessons.length} lesson${context.completedLessons.length === 1 ? "" : "s"} completed`,
    context.sessionStreakDays > 0
      ? `${context.sessionStreakDays}-day learning streak`
      : null,
    context.certificationPath
      ? `working toward ${context.certificationPath} certification`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  const membershipDisplay =
    context.membership === "public"
      ? "Public visitor"
      : context.membership === "free"
        ? "Free member"
        : context.membership === "basic"
          ? "Basic member"
          : context.membership === "premium"
            ? "Premium member"
            : context.membership === "enterprise"
              ? "Enterprise member"
              : "Beta member";

  const competency = resolveCompetency(context.progressPercent);
  const depthGuidance =
    competency === "beginner"
      ? "Use clear, simple language. Introduce concepts step by step. Ask one question at a time and verify understanding before continuing."
      : competency === "intermediate"
        ? "Explore risk, liquidity, cash flow, ROI, and opportunity cost. Challenge assumptions with concrete examples."
        : "Require evidence-based reasoning, multiple scenarios, quantitative analysis, and discussion of competing viewpoints.";

  return `You are the Edunancial AI Educational Coach. Edunancial's mission is to help people build practical financial knowledge they can confidently apply to improve their financial decision-making throughout their lives.

CURRENT LEARNER CONTEXT:
- Curriculum: ${trackDescription}
- Level: ${levelInfo}
- Lesson: ${lessonInfo || "General learning"}
- Current Page: ${context.pathname}
- Jurisdiction: ${context.jurisdiction} (Country: ${context.country})
- Language: ${context.language}
- Membership: ${membershipDisplay}
- Progress: ${progressParts}
${lessonObjectives ? `\nLEARNING OBJECTIVES FOR THIS LESSON:\n${lessonObjectives}` : ""}
COACHING DEPTH: ${depthGuidance}

COACHING GUIDELINES:
1. Answer within the context of the current lesson and curriculum track listed above.
2. When asked about another jurisdiction (e.g., "what would this be in Canada?"), compare concepts across jurisdictions while keeping the curriculum context intact.
3. Provide jurisdiction-specific examples relevant to ${context.jurisdiction}.
4. Use positive reinforcement when acknowledging learner progress.
5. Never recommend specific stocks, specific investments, or personalized financial advice.
6. Keep responses practical, educational, and actionable.
7. IMPORTANT: Respond entirely in the language identified by code "${context.language}". For "es" respond in Spanish. For "fr-CA" or "fr-FR" respond in French. For "pt" respond in Portuguese. For "ar" respond in Arabic. For "ja" respond in Japanese. For "ko" respond in Korean. For "zh-Hans" or "zh-Hant" respond in Chinese. Otherwise respond in English.
8. When educational disclaimers are appropriate (tax, legal, investment topics), include them in the disclaimers array.
9. Provide 2–3 concrete follow-up suggestions to continue learning.
10. If the learner has made significant progress, acknowledge it in the milestone field.

IMPORTANT BOUNDARIES:
- You are an educational coach, not a financial advisor.
- Do not recommend specific investments, stocks, funds, or products.
- Do not provide personalized tax, legal, or accounting advice.
- All content is for educational purposes only.

Respond with a JSON object using this exact structure:
{
  "message": "Your main coaching response (2–4 paragraphs, educational and encouraging)",
  "suggestions": ["Follow-up suggestion 1", "Follow-up suggestion 2", "Follow-up suggestion 3"],
  "disclaimers": ["Disclaimer text if applicable"],
  "milestone": "Milestone recognition text if notable progress was made, or null"
}`;
}

async function callOpenAIAPI(
  systemPrompt: string,
  userMessage: string,
): Promise<ParsedAIResponse | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.AI_LEARNING_MODEL ?? DEFAULT_MODEL;
  const maxTokensRaw = Number(process.env.AI_LEARNING_MAX_TOKENS);
  const maxTokens = Number.isFinite(maxTokensRaw) && maxTokensRaw > 0 ? maxTokensRaw : DEFAULT_MAX_TOKENS;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content) as Partial<ParsedAIResponse>;
    return {
      message: typeof parsed.message === "string" ? parsed.message : "",
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions.map(String)
        : [],
      disclaimers: Array.isArray(parsed.disclaimers)
        ? parsed.disclaimers.map(String)
        : [],
      milestone: typeof parsed.milestone === "string" ? parsed.milestone : null,
    };
  } catch {
    return null;
  }
}

export async function generateAILearningResponse(
  request: AILearningRequest,
): Promise<AILearningResponse> {
  const config = mergeAILearningConfig(request.config);
  const context = request.context;

  const enabled =
    config.enabledGlobally &&
    canUseAILearningTrack(context.track, config) &&
    canUseAILearningLesson(context.lessonId, config) &&
    config.supportedLanguages.includes(context.language) &&
    config.supportedJurisdictions.includes(context.jurisdiction);

  if (!enabled) {
    return {
      enabled: false,
      message:
        "The AI Learning Network is currently unavailable for this lesson, jurisdiction, or language configuration.",
      suggestions: ["Continue with the current lesson", "Contact support or your administrator"],
      disclaimers: [EDUCATIONAL_DISCLAIMER],
      milestone: null,
      contextSummary: summarizeContext(context),
    };
  }

  const isPublicVisitor = context.membership === "public" || context.membership === "free";

  if (isPublicVisitor && !config.publicAssistanceEnabled) {
    return {
      enabled: false,
      message:
        "AI lesson-specific coaching is currently reserved for members. You can still browse public curriculum previews.",
      suggestions: ["Review available public lessons", "Become a member for full AI curriculum coaching"],
      disclaimers: [EDUCATIONAL_DISCLAIMER],
      milestone: null,
      contextSummary: summarizeContext(context),
    };
  }

  const asksForSpecificInvestment = INVESTMENT_REQUEST_PATTERN.test(request.message);
  const competency = resolveCompetency(context.progressPercent);
  const guardrail = evaluateCoachRequest({
    competency,
    topic: context.topic ?? context.lessonId ?? "current lesson",
    asksForSpecificInvestment,
  });

  const disclaimers = SENSITIVE_TOPIC_PATTERN.test(request.message)
    ? [EDUCATIONAL_DISCLAIMER]
    : [];

  if (!guardrail.permitted) {
    return {
      enabled: true,
      message: guardrail.message,
      suggestions: [
        "Ask for a concept explanation from your current lesson",
        "Ask for a practice scenario instead of specific investment picks",
      ],
      disclaimers: [...disclaimers, EDUCATIONAL_DISCLAIMER],
      milestone: determineMilestone(context),
      contextSummary: summarizeContext(context),
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      enabled: false,
      message:
        "The AI Learning Coach is not yet configured for this deployment. Please contact support or check back soon.",
      suggestions: ["Continue with the current lesson materials", "Review the lesson objectives"],
      disclaimers: [],
      milestone: null,
      contextSummary: summarizeContext(context),
    };
  }

  const lessonObjectives = loadLessonObjectives(context.track, context.level, context.lessonId);
  const systemPrompt = buildSystemPrompt(context, lessonObjectives);
  const aiResponse = await callOpenAIAPI(systemPrompt, request.message);

  if (!aiResponse || !aiResponse.message) {
    return {
      enabled: false,
      message:
        "The AI Learning Coach is temporarily unavailable. Please try again in a moment.",
      suggestions: ["Try again in a few seconds", "Continue with the current lesson materials"],
      disclaimers: [],
      milestone: null,
      contextSummary: summarizeContext(context),
    };
  }

  return {
    enabled: true,
    message: aiResponse.message,
    suggestions:
      aiResponse.suggestions.length > 0
        ? aiResponse.suggestions
        : [
            "Ask for a quiz on this lesson",
            "Ask for a practical scenario you can apply",
            context.track && context.level
              ? `Continue with ${context.track} Level ${context.level}`
              : "Open a curriculum lesson for lesson-specific coaching",
          ],
    disclaimers: aiResponse.disclaimers,
    milestone: aiResponse.milestone ?? determineMilestone(context),
    contextSummary: summarizeContext(context),
  };
}

function resolveCompetency(progressPercent: number): "beginner" | "intermediate" | "advanced" {
  if (progressPercent >= 70) return "advanced";
  if (progressPercent >= 30) return "intermediate";
  return "beginner";
}

function determineMilestone(context: AILearningContext): string | null {
  if (context.progressPercent >= 75) {
    return "Excellent progress — you have crossed the 75% milestone.";
  }

  if (context.progressPercent >= 50) {
    return "Great momentum — you are halfway through your learning path.";
  }

  if (context.completedLessons.length > 0) {
    return "Nice work completing lessons — keep your streak going.";
  }

  return null;
}

function summarizeContext(context: AILearningContext): string {
  const pieces = [
    context.track ? `${context.track} track` : null,
    context.level ? `Level ${context.level}` : null,
    context.lessonId ? `Lesson ${context.lessonId}` : null,
    context.jurisdiction ? `Jurisdiction ${context.jurisdiction}` : null,
    context.language ? `Language ${context.language}` : null,
    `Membership ${context.membership}`,
  ].filter(Boolean);

  return pieces.join(" · ");
}
