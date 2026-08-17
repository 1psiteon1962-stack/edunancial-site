import { getLessonContent } from "@/lib/curriculum/reader";

import type { AILearningContext } from "./context";
import { getAuthoritativeDomains, getJurisdiction } from "./jurisdictions";
import {
  buildLessonBoundedLocalizationInstruction,
  isQuestionWithinLessonScope,
  normalizeLearningJurisdiction,
  type LocalizedLessonAnswer,
} from "./localization";

const EDUCATIONAL_DISCLAIMER =
  "Educational purposes only. Results and rules vary by individual circumstances and jurisdiction. This is not financial, legal, tax, accounting, or investment advice.";

const DEFAULT_MODEL = "gpt-5-mini";
const SOURCE_JURISDICTION = "US";

export interface JurisdictionAwareRequest {
  message: string;
  context: AILearningContext;
}

export interface JurisdictionAwareResponse extends LocalizedLessonAnswer {
  enabled: boolean;
  contextSummary: string;
}

function emptyResponse(message: string, context: AILearningContext): JurisdictionAwareResponse {
  return {
    enabled: false,
    message,
    suggestions: [],
    disclaimers: [EDUCATIONAL_DISCLAIMER],
    milestone: null,
    jurisdictionNotes: [],
    sources: [],
    reviewStatus: "needs-review",
    contextSummary: `${context.lessonId ?? "No lesson"} · ${context.jurisdiction} · ${context.language}`,
  };
}

function extractOutputText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const response = data as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };
  if (typeof response.output_text === "string") return response.output_text;
  return (response.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text" && typeof item.text === "string")
    .map((item) => item.text)
    .join("\n");
}

function normalizeParsedResponse(raw: string): LocalizedLessonAnswer | null {
  try {
    const parsed = JSON.parse(raw) as Partial<LocalizedLessonAnswer>;
    if (typeof parsed.message !== "string" || !parsed.message.trim()) return null;
    return {
      message: parsed.message,
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String).slice(0, 3) : [],
      disclaimers: Array.isArray(parsed.disclaimers) ? parsed.disclaimers.map(String) : [],
      milestone: typeof parsed.milestone === "string" ? parsed.milestone : null,
      jurisdictionNotes: Array.isArray(parsed.jurisdictionNotes)
        ? parsed.jurisdictionNotes.map(String)
        : [],
      sources: Array.isArray(parsed.sources)
        ? parsed.sources
            .filter((source) => source && typeof source.url === "string" && typeof source.title === "string")
            .map((source) => ({
              title: source.title,
              url: source.url,
              publisher: source.publisher,
              accessedAt: new Date().toISOString(),
            }))
        : [],
      reviewStatus: "ai-generated",
    };
  } catch {
    return null;
  }
}

export async function generateJurisdictionAwareLessonResponse(
  request: JurisdictionAwareRequest,
): Promise<JurisdictionAwareResponse> {
  const { context } = request;
  if (!context.lessonId) {
    return emptyResponse("Open a curriculum lesson before using jurisdiction-aware localization.", context);
  }

  const learningJurisdiction = normalizeLearningJurisdiction(context.jurisdiction);
  const jurisdiction = getJurisdiction(learningJurisdiction);
  if (!jurisdiction) {
    return emptyResponse(
      `Jurisdiction ${learningJurisdiction} is not yet enabled for authoritative localization.`,
      context,
    );
  }

  // Always load the canonical lesson in English. Language is a rendering choice;
  // it must never change the substantive source lesson or learning jurisdiction.
  const canonicalLesson = getLessonContent(context.lessonId, "en");
  if (!canonicalLesson) {
    return emptyResponse("The canonical lesson could not be loaded, so localization was stopped safely.", context);
  }

  if (!isQuestionWithinLessonScope(request.message, canonicalLesson.body, canonicalLesson.meta.title)) {
    return {
      ...emptyResponse(
        "That question is outside the active lesson. Ask about the lesson you are currently reading, and I can explain how it applies in your selected jurisdiction.",
        context,
      ),
      enabled: true,
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return emptyResponse("The jurisdiction-aware AI provider is not configured for this deployment.", context);
  }

  const instruction = buildLessonBoundedLocalizationInstruction({
    scope: {
      lessonId: context.lessonId,
      displayLanguage: context.language,
      learningJurisdiction,
      sourceJurisdiction: SOURCE_JURISDICTION,
      learnerLocation: context.country,
      adaptationType:
        learningJurisdiction === SOURCE_JURISDICTION ? "translation" : "jurisdiction-adaptation",
    },
    canonicalLesson: canonicalLesson.body,
    lessonTitle: canonicalLesson.meta.title,
  });

  const authoritativeDomains = getAuthoritativeDomains(learningJurisdiction);
  const model = process.env.AI_LOCALIZATION_MODEL ?? process.env.AI_LEARNING_MODEL ?? DEFAULT_MODEL;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        instructions: instruction,
        input: request.message,
        tools: authoritativeDomains.length
          ? [{ type: "web_search", filters: { allowed_domains: authoritativeDomains } }]
          : [{ type: "web_search" }],
        tool_choice: "auto",
        max_output_tokens: 1800,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      return emptyResponse("Authoritative localization is temporarily unavailable. No unverified substitute was shown.", context);
    }

    const parsed = normalizeParsedResponse(extractOutputText(await response.json()));
    if (!parsed) {
      return emptyResponse("The localization response failed validation. No partial or malformed answer was shown.", context);
    }

    return {
      ...parsed,
      enabled: true,
      disclaimers: Array.from(new Set([...parsed.disclaimers, EDUCATIONAL_DISCLAIMER])),
      contextSummary: `${context.lessonId} · ${jurisdiction.name} · ${context.language}`,
    };
  } catch {
    return emptyResponse("Authoritative localization is temporarily unavailable. Please try again.", context);
  }
}
