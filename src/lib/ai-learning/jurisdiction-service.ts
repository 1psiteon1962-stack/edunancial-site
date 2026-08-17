import { getLessonContent } from "@/lib/curriculum/reader";

import { getJurisdictionPolicy } from "./jurisdiction-policy";
import {
  buildLessonBoundedLocalizationInstruction,
  isQuestionWithinLessonScope,
  normalizeLearningJurisdiction,
  type LocalizedLessonAnswer,
} from "./localization";

const DEFAULT_MODEL = "gpt-5-mini";
const DEFAULT_MAX_OUTPUT_TOKENS = 1800;
const EDUCATIONAL_DISCLAIMER =
  "Educational purposes only. This is not financial, legal, tax, accounting, or investment advice; outcomes and requirements depend on individual circumstances and current local rules.";

export interface JurisdictionLessonRequest {
  message: string;
  lessonId: string;
  displayLanguage: string;
  learningJurisdiction: string;
  learnerLocation?: string | null;
  sourceJurisdiction?: string;
}

interface ResponsesAPIResult {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
}

function extractOutputText(data: ResponsesAPIResult): string {
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text;
  for (const item of data.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

function parseAnswer(raw: string): LocalizedLessonAnswer | null {
  try {
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    const parsed = JSON.parse(cleaned) as Partial<LocalizedLessonAnswer>;
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
              title: String(source.title),
              url: String(source.url),
              publisher: source.publisher ? String(source.publisher) : undefined,
            }))
        : [],
      reviewStatus: "ai-generated",
    };
  } catch {
    return null;
  }
}

export async function generateJurisdictionLessonResponse(
  request: JurisdictionLessonRequest,
): Promise<LocalizedLessonAnswer & { enabled: boolean; lessonId: string; learningJurisdiction: string }> {
  const lessonId = request.lessonId.trim().toUpperCase();
  const learningJurisdiction = normalizeLearningJurisdiction(request.learningJurisdiction);
  const sourceJurisdiction = normalizeLearningJurisdiction(request.sourceJurisdiction ?? "US");
  const canonicalLesson = getLessonContent(lessonId, "en");

  if (!canonicalLesson) {
    return {
      enabled: false,
      lessonId,
      learningJurisdiction,
      message: "The selected lesson could not be loaded, so jurisdiction localization was not attempted.",
      suggestions: [],
      disclaimers: [EDUCATIONAL_DISCLAIMER],
      milestone: null,
      jurisdictionNotes: [],
      sources: [],
      reviewStatus: "needs-review",
    };
  }

  if (!isQuestionWithinLessonScope(request.message, canonicalLesson.body, canonicalLesson.meta.title)) {
    return {
      enabled: true,
      lessonId,
      learningJurisdiction,
      message: "That question falls outside the active lesson. I can explain or localize the concepts covered by this lesson for your selected jurisdiction.",
      suggestions: [
        "Explain this lesson using my jurisdiction's rules",
        "Which parts of this lesson differ from the U.S. system?",
      ],
      disclaimers: [EDUCATIONAL_DISCLAIMER],
      milestone: null,
      jurisdictionNotes: [],
      sources: [],
      reviewStatus: "ai-generated",
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      enabled: false,
      lessonId,
      learningJurisdiction,
      message: "Jurisdiction-aware AI is installed but the AI provider key is not configured for this deployment.",
      suggestions: ["Continue with the published lesson"],
      disclaimers: [EDUCATIONAL_DISCLAIMER],
      milestone: null,
      jurisdictionNotes: [],
      sources: [],
      reviewStatus: "needs-review",
    };
  }

  const policy = getJurisdictionPolicy(learningJurisdiction);
  const instruction = buildLessonBoundedLocalizationInstruction({
    scope: {
      lessonId,
      displayLanguage: request.displayLanguage,
      learningJurisdiction,
      sourceJurisdiction,
      learnerLocation: request.learnerLocation,
      adaptationType:
        learningJurisdiction === sourceJurisdiction ? "translation" : "jurisdiction-adaptation",
    },
    canonicalLesson: canonicalLesson.body,
    lessonTitle: canonicalLesson.meta.title,
  });

  const domainInstruction = policy.authoritativeDomains.length
    ? `For jurisdiction-sensitive research, prioritize these official domains when relevant: ${policy.authoritativeDomains.join(", ")}.`
    : "For jurisdiction-sensitive research, prioritize primary government and regulatory sources for the selected jurisdiction.";

  const model = process.env.AI_LOCALIZATION_MODEL ?? process.env.AI_LEARNING_MODEL ?? DEFAULT_MODEL;
  const maxRaw = Number(process.env.AI_LOCALIZATION_MAX_OUTPUT_TOKENS);
  const maxOutputTokens = Number.isFinite(maxRaw) && maxRaw > 0 ? maxRaw : DEFAULT_MAX_OUTPUT_TOKENS;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        instructions: `${instruction}\n\n${domainInstruction}`,
        input: request.message,
        tools: [{ type: "web_search" }],
        max_output_tokens: maxOutputTokens,
      }),
      signal: AbortSignal.timeout(35_000),
    });

    if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
    const data = (await response.json()) as ResponsesAPIResult;
    const parsed = parseAnswer(extractOutputText(data));
    if (!parsed) throw new Error("AI provider returned an invalid localization payload");

    const requiresReview =
      learningJurisdiction !== sourceJurisdiction &&
      parsed.jurisdictionNotes.length > 0 &&
      parsed.sources.length === 0;

    return {
      ...parsed,
      enabled: true,
      lessonId,
      learningJurisdiction,
      disclaimers: Array.from(new Set([...parsed.disclaimers, EDUCATIONAL_DISCLAIMER])),
      reviewStatus: requiresReview ? "needs-review" : "ai-generated",
    };
  } catch {
    return {
      enabled: false,
      lessonId,
      learningJurisdiction,
      message: "Jurisdiction-aware lesson localization is temporarily unavailable. The published lesson remains available without AI adaptation.",
      suggestions: ["Continue with the published lesson", "Try jurisdiction localization again shortly"],
      disclaimers: [EDUCATIONAL_DISCLAIMER],
      milestone: null,
      jurisdictionNotes: [],
      sources: [],
      reviewStatus: "needs-review",
    };
  }
}
