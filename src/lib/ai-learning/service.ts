import { evaluateCoachRequest } from "@/lib/ai/guardrails";
import { getLessonContent } from "@/lib/curriculum/reader";

import { canUseAILearningLesson, canUseAILearningTrack, mergeAILearningConfig, type AILearningAdminConfig } from "./config";
import type { AILearningContext } from "./context";

export interface AILearningRequest { message: string; context: AILearningContext; config?: Partial<AILearningAdminConfig>; }
export interface AILearningResponse { message: string; suggestions: string[]; disclaimers: string[]; milestone: string | null; contextSummary: string; enabled: boolean; }

const EDUCATIONAL_DISCLAIMER = "Educational content only — not individualized legal, tax, accounting, investment, estate planning, or financial planning advice.";
const SENSITIVE_TOPIC_PATTERN = /(law|legal|tax|taxes|investment|invest|accounting|estate|financial planning|regulation|employment law|property law)/i;
const INVESTMENT_REQUEST_PATTERN = /(which stock|what should i buy|specific investment|pick a crypto|buy this stock)/i;
const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_MAX_TOKENS = 1200;
const TRACK_DISPLAY_NAMES: Record<string, string> = { RED: "Red Academy (Real Estate)", WHITE: "White Academy (Paper Assets)", BLUE: "Blue Academy (Business)", GREEN: "Green Academy (Taxes)", GOLD: "Gold Academy (Investing)", PURPLE: "Purple Academy (Law)", ORANGE: "Orange Academy (Sales & Marketing)", BLACK: "Black Academy (Leadership & Executive Management)" };
interface ParsedAIResponse { message: string; suggestions: string[]; disclaimers: string[]; milestone: string | null; }

function loadLessonObjectives(lessonId: string | null, languageCode: string): string {
  if (!lessonId || !/^[A-Z0-9-]{3,30}$/.test(lessonId.toUpperCase())) return "";
  const lesson = getLessonContent(lessonId.toUpperCase(), languageCode);
  if (!lesson) return "";
  const objectivesMatch = lesson.body.match(/##\s+(Learning Objectives|Objectifs d'apprentissage|Objetivos de aprendizaje)\n([\s\S]*?)(?=\n##|\n---|\s*$)/iu);
  return objectivesMatch?.[2]?.trim() || (lesson.meta.title ? `Lesson: ${lesson.meta.title}` : "");
}

function buildSystemPrompt(context: AILearningContext, lessonObjectives: string): string {
  const trackDescription = context.track ? (TRACK_DISPLAY_NAMES[context.track] ?? context.track) : "General";
  const lessonInfo = [context.lessonId, context.topic].filter(Boolean).join(" — ");
  const jurisdictionKnown = Boolean(context.jurisdiction && context.jurisdictionConfirmedAt);
  const jurisdictionBoundary = jurisdictionKnown
    ? `The learner has confirmed ${context.jurisdiction}${context.subdivisionCode ? `-${context.subdivisionCode}` : ""}. This general coach still has NO authority to invent or recall jurisdiction-specific law, tax, regulatory, employment, or property rules. Explain universal concepts only for sensitive subjects and direct jurisdiction-specific treatment to Edunancial's verified jurisdiction-grounding service.`
    : "The learner jurisdiction is not confirmed. Teach universal concepts only. Never infer jurisdiction from language, IP/session location, curriculum source material, or model knowledge.";
  const progressParts = [`${context.progressPercent}% of curriculum complete`, `${context.completedLessons.length} lessons completed`].join(", ");
  return `You are the Edunancial AI Educational Coach.\n\nCURRENT LEARNER CONTEXT:\n- Curriculum: ${trackDescription}\n- Level: ${context.level ? `Level ${context.level}` : "General"}\n- Lesson: ${lessonInfo || "General learning"}\n- Language: ${context.language}\n- Progress: ${progressParts}\n${lessonObjectives ? `\nLEARNING OBJECTIVES:\n${lessonObjectives}` : ""}\n\nJURISDICTION SAFETY:\n${jurisdictionBoundary}\n\nCOACHING GUIDELINES:\n1. Stay within the active lesson and curriculum track.\n2. For law, tax, regulation, employment, property, or other jurisdiction-sensitive subjects, explain universal principles only unless verified grounding is supplied by the dedicated grounding path.\n3. Never substitute United States rules, common-law rules, or another country's rules for missing local authority.\n4. Never infer substantive law from the learner's physical/session location.\n5. Never recommend specific investments or personalized financial advice.\n6. Respond entirely in language code ${context.language}.\n7. Provide 2–3 useful follow-up learning suggestions.\n\nRespond as JSON: {"message":"...","suggestions":["..."],"disclaimers":["..."],"milestone":null}`;
}

async function callOpenAIAPI(systemPrompt: string, userMessage: string): Promise<ParsedAIResponse | null> {
  const apiKey = process.env.OPENAI_API_KEY; if (!apiKey) return null;
  const model = process.env.AI_LEARNING_MODEL ?? DEFAULT_MODEL;
  const raw = Number(process.env.AI_LEARNING_MAX_TOKENS); const maxTokens = Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_MAX_TOKENS;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }], response_format: { type: "json_object" }, max_tokens: maxTokens, temperature: 0.7 }), signal: AbortSignal.timeout(25_000) });
    if (!response.ok) return null;
    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] }; const content = data.choices?.[0]?.message?.content; if (!content) return null;
    const parsed = JSON.parse(content) as Partial<ParsedAIResponse>;
    return { message: typeof parsed.message === "string" ? parsed.message : "", suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String) : [], disclaimers: Array.isArray(parsed.disclaimers) ? parsed.disclaimers.map(String) : [], milestone: typeof parsed.milestone === "string" ? parsed.milestone : null };
  } catch { return null; }
}

export async function generateAILearningResponse(request: AILearningRequest): Promise<AILearningResponse> {
  const config = mergeAILearningConfig(request.config); const context = request.context;
  const enabled = config.enabledGlobally && canUseAILearningTrack(context.track, config) && canUseAILearningLesson(context.lessonId, config) && config.supportedLanguages.includes(context.language) && config.supportedJurisdictions.includes(context.jurisdiction);
  const base = { contextSummary: summarizeContext(context), milestone: null };
  if (!enabled) return { ...base, enabled: false, message: "The AI Learning Network is currently unavailable for this lesson, jurisdiction, or language configuration.", suggestions: ["Continue with the current lesson"], disclaimers: [EDUCATIONAL_DISCLAIMER] };
  if ((context.membership === "public" || context.membership === "free") && !config.publicAssistanceEnabled) return { ...base, enabled: false, message: "AI lesson-specific coaching is currently reserved for members. You can still browse public curriculum previews.", suggestions: ["Review available public lessons"], disclaimers: [EDUCATIONAL_DISCLAIMER] };
  const guardrail = evaluateCoachRequest({ competency: resolveCompetency(context.progressPercent), topic: context.topic ?? context.lessonId ?? "current lesson", asksForSpecificInvestment: INVESTMENT_REQUEST_PATTERN.test(request.message) });
  const sensitive = SENSITIVE_TOPIC_PATTERN.test(request.message);
  if (!guardrail.permitted) return { ...base, enabled: true, message: guardrail.message, suggestions: ["Ask for a concept explanation", "Ask for a practice scenario"], disclaimers: [EDUCATIONAL_DISCLAIMER], milestone: determineMilestone(context) };
  if (!process.env.OPENAI_API_KEY) return { ...base, enabled: false, message: "The AI Learning Coach is not yet configured for this deployment.", suggestions: ["Continue with the current lesson materials"], disclaimers: [] };
  const systemPrompt = buildSystemPrompt(context, loadLessonObjectives(context.lessonId, context.language));
  const aiResponse = await callOpenAIAPI(systemPrompt, request.message);
  if (!aiResponse?.message) return { ...base, enabled: false, message: "The AI Learning Coach is temporarily unavailable. Please try again in a moment.", suggestions: ["Continue with the current lesson materials"], disclaimers: [] };
  return { enabled: true, message: aiResponse.message, suggestions: aiResponse.suggestions.length ? aiResponse.suggestions : ["Ask for a quiz on this lesson", "Ask for a practical scenario"], disclaimers: Array.from(new Set([...aiResponse.disclaimers, ...(sensitive ? [EDUCATIONAL_DISCLAIMER] : [])])), milestone: aiResponse.milestone ?? determineMilestone(context), contextSummary: summarizeContext(context) };
}

function resolveCompetency(progressPercent: number): "beginner" | "intermediate" | "advanced" { return progressPercent >= 70 ? "advanced" : progressPercent >= 30 ? "intermediate" : "beginner"; }
function determineMilestone(context: AILearningContext): string | null { if (context.progressPercent >= 75) return "Excellent progress — you have crossed the 75% milestone."; if (context.progressPercent >= 50) return "Great momentum — you are halfway through your learning path."; if (context.completedLessons.length) return "Nice work completing lessons — keep your streak going."; return null; }
function summarizeContext(context: AILearningContext): string { return [context.track ? `${context.track} track` : null, context.level ? `Level ${context.level}` : null, context.lessonId ? `Lesson ${context.lessonId}` : null, context.jurisdiction ? `Jurisdiction ${context.jurisdiction}` : null, context.language ? `Language ${context.language}` : null, `Membership ${context.membership}`].filter(Boolean).join(" · "); }
