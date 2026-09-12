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
  /** Explicit jurisdiction represented by the canonical source lesson, when known. Never inferred. */
  sourceJurisdiction?: string;
}

interface ResponsesAPIResult {
  output_text?: string;
  output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
}

function extractOutputText(data: ResponsesAPIResult): string {
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text;
  for (const item of data.output ?? []) for (const content of item.content ?? []) if (content.type === "output_text" && typeof content.text === "string") return content.text;
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
      jurisdictionNotes: Array.isArray(parsed.jurisdictionNotes) ? parsed.jurisdictionNotes.map(String) : [],
      sources: Array.isArray(parsed.sources) ? parsed.sources.filter((source) => source && typeof source.url === "string" && typeof source.title === "string").map((source) => ({ title: String(source.title), url: String(source.url), publisher: source.publisher ? String(source.publisher) : undefined })) : [],
      reviewStatus: "ai-generated",
    };
  } catch { return null; }
}

export async function generateJurisdictionLessonResponse(request: JurisdictionLessonRequest): Promise<LocalizedLessonAnswer & { enabled: boolean; lessonId: string; learningJurisdiction: string }> {
  const lessonId = request.lessonId.trim().toUpperCase();
  const learningJurisdiction = normalizeLearningJurisdiction(request.learningJurisdiction);
  const sourceJurisdiction = request.sourceJurisdiction ? normalizeLearningJurisdiction(request.sourceJurisdiction) : "";
  const canonicalLesson = getLessonContent(lessonId, "en");

  const unavailable = (message: string): LocalizedLessonAnswer & { enabled: boolean; lessonId: string; learningJurisdiction: string } => ({ enabled: false, lessonId, learningJurisdiction, message, suggestions: [], disclaimers: [EDUCATIONAL_DISCLAIMER], milestone: null, jurisdictionNotes: [], sources: [], reviewStatus: "needs-review" });

  if (!canonicalLesson) return unavailable("The selected lesson could not be loaded, so jurisdiction localization was not attempted.");
  if (!learningJurisdiction) return unavailable("The learner jurisdiction is not confirmed, so jurisdiction-specific localization was not attempted.");

  if (!isQuestionWithinLessonScope(request.message, canonicalLesson.body, canonicalLesson.meta.title)) {
    return { enabled: true, lessonId, learningJurisdiction, message: "That question falls outside the active lesson. I can explain or localize the concepts covered by this lesson for your selected jurisdiction.", suggestions: ["Explain this lesson using my jurisdiction's rules", "Explain which parts of this lesson are jurisdiction-sensitive"], disclaimers: [EDUCATIONAL_DISCLAIMER], milestone: null, jurisdictionNotes: [], sources: [], reviewStatus: "ai-generated" };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return unavailable("Jurisdiction-aware AI is installed but the AI provider key is not configured for this deployment.");

  const policy = getJurisdictionPolicy(learningJurisdiction);
  const instruction = buildLessonBoundedLocalizationInstruction({
    scope: {
      lessonId,
      displayLanguage: request.displayLanguage,
      learningJurisdiction,
      sourceJurisdiction,
      learnerLocation: request.learnerLocation,
      adaptationType: sourceJurisdiction && learningJurisdiction === sourceJurisdiction ? "translation" : "jurisdiction-adaptation",
    },
    canonicalLesson: canonicalLesson.body,
    lessonTitle: canonicalLesson.meta.title,
  });

  const sourceInstruction = sourceJurisdiction
    ? `The canonical lesson explicitly identifies ${sourceJurisdiction} as its source jurisdiction. Do not apply that jurisdiction's rules to the learner unless they are independently verified for ${learningJurisdiction}.`
    : `The canonical lesson has no verified source jurisdiction metadata. Treat jurisdiction-sensitive statements in it as unverified background only; never assume they are United States rules or applicable to ${learningJurisdiction}.`;
  const domainInstruction = policy.authoritativeDomains.length ? `For jurisdiction-sensitive research, prioritize these official domains when relevant: ${policy.authoritativeDomains.join(", ")}.` : "For jurisdiction-sensitive research, prioritize primary government and regulatory sources for the selected jurisdiction.";
  const model = process.env.AI_LOCALIZATION_MODEL ?? process.env.AI_LEARNING_MODEL ?? DEFAULT_MODEL;
  const maxRaw = Number(process.env.AI_LOCALIZATION_MAX_OUTPUT_TOKENS);
  const maxOutputTokens = Number.isFinite(maxRaw) && maxRaw > 0 ? maxRaw : DEFAULT_MAX_OUTPUT_TOKENS;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model, instructions: `${instruction}\n\n${sourceInstruction}\n\n${domainInstruction}`, input: request.message, tools: [{ type: "web_search" }], max_output_tokens: maxOutputTokens }), signal: AbortSignal.timeout(35_000) });
    if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
    const parsed = parseAnswer(extractOutputText((await response.json()) as ResponsesAPIResult));
    if (!parsed) throw new Error("AI provider returned an invalid localization payload");
    const hasJurisdictionClaims = parsed.jurisdictionNotes.length > 0;
    const requiresReview = hasJurisdictionClaims && parsed.sources.length === 0;
    return { ...parsed, enabled: true, lessonId, learningJurisdiction, disclaimers: Array.from(new Set([...parsed.disclaimers, EDUCATIONAL_DISCLAIMER])), reviewStatus: requiresReview ? "needs-review" : "ai-generated" };
  } catch {
    return { ...unavailable("Jurisdiction-aware lesson localization is temporarily unavailable. The published lesson remains available without AI adaptation."), suggestions: ["Continue with the published lesson", "Try jurisdiction localization again shortly"] };
  }
}
