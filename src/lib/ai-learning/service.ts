import {
  buildCountrySelectionContext,
  buildCoachingInstruction,
  resolveCountryContext,
} from "@/lib/ai/country-selection";
import { getCountryKnowledge } from "@/lib/ai/country-knowledge";
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
const JURISDICTION_COMPARE_PATTERN = /(what would this be in|compare|equivalent in|difference in)/i;

const LANGUAGE_OPENERS: Record<string, string> = {
  es: "Vamos a estudiar esto paso a paso.",
  "fr-CA": "Étudions cela étape par étape.",
  "fr-FR": "Étudions cela étape par étape.",
};

export function generateAILearningResponse(request: AILearningRequest): AILearningResponse {
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
      message: `${localizedOpener(context.language)} ${guardrail.message}`,
      suggestions: [
        "Ask for a concept explanation from your current lesson",
        "Ask for a practice scenario instead of specific investment picks",
      ],
      disclaimers: [...disclaimers, EDUCATIONAL_DISCLAIMER],
      milestone: determineMilestone(context),
      contextSummary: summarizeContext(context),
    };
  }

  const jurisdictionComparison = maybeBuildJurisdictionComparison(context, request.message);
  const progressCoaching = buildProgressCoaching(context);

  const messageSections = [
    localizedOpener(context.language),
    `Curriculum focus: ${summarizeContext(context)}.`,
    `Coaching mode: ${guardrail.message}`,
    jurisdictionComparison,
    progressCoaching,
  ].filter(Boolean);

  const suggestions = [
    "Ask for a 3-question quiz on this lesson",
    "Ask for one practical scenario you can apply this week",
    context.level && context.track
      ? `Continue with ${context.track} Level ${context.level}${context.lessonId ? ` after ${context.lessonId}` : ""}`
      : "Open a curriculum lesson to get lesson-specific coaching",
  ];

  if (isPublicVisitor) {
    suggestions.push("Upgrade membership for full lesson-by-lesson coaching and certification prep");
  }

  return {
    enabled: true,
    message: messageSections.join("\n\n"),
    suggestions,
    disclaimers,
    milestone: determineMilestone(context),
    contextSummary: summarizeContext(context),
  };
}

function localizedOpener(language: string): string {
  return LANGUAGE_OPENERS[language] ?? "Let's work through this lesson together.";
}

function resolveCompetency(progressPercent: number): "beginner" | "intermediate" | "advanced" {
  if (progressPercent >= 70) {
    return "advanced";
  }

  if (progressPercent >= 30) {
    return "intermediate";
  }

  return "beginner";
}

function maybeBuildJurisdictionComparison(context: AILearningContext, message: string): string {
  if (!JURISDICTION_COMPARE_PATTERN.test(message)) {
    return "";
  }

  const requestedIso = inferRequestedCountryIso(message) ?? context.jurisdiction;

  try {
    const levelContext = buildCountrySelectionContext({
      homeCountryIso: context.country,
      level: context.level && context.level >= 3 ? 3 : context.level === 2 ? 2 : 1,
      mode: requestedIso === context.country ? "home" : requestedIso === "US" ? "us" : "other",
      requestedIso,
    });
    const resolved = resolveCountryContext(levelContext);
    const selectedCountry = resolved.knowledge ?? getCountryKnowledge(requestedIso);
    const homeCountry = getCountryKnowledge(context.country);

  if (!selectedCountry) {
    const requestedLabel = countryLabelFromIso(requestedIso);
    return `I can explain the concept generally and note where local rules may differ when country-specific knowledge is unavailable for ${requestedLabel}.`;
  }

  const comparisonLabel = homeCountry ? `Compared with ${homeCountry.country}` : "Compared with your current jurisdiction";

  const entityA = selectedCountry.businessEntities[0];
  const entityB = homeCountry?.businessEntities[0];

    return [
      buildCoachingInstruction(resolved),
      `${comparisonLabel}, ${selectedCountry.country} commonly uses ${entityA?.localName ?? "local entity structures"}.`,
      entityB
        ? `${homeCountry.country} frequently uses ${entityB.localName}, while ${selectedCountry.country} may use different filing or tax authorities.`
        : `${selectedCountry.country} may differ in tax authority (${selectedCountry.taxation.taxAuthorityLocalName}) and registration body (${selectedCountry.companyRegistration.registrationBodyLocalName}).`,
    ].join(" ");
  } catch {
    return "I can compare jurisdictions at a general educational level. For deeper country-specific detail, continue to lessons where country context is unlocked.";
  }
}


function countryLabelFromIso(iso: string): string {
  const labels: Record<string, string> = {
    US: "United States",
    CA: "Canada",
    MX: "Mexico",
    DO: "Dominican Republic",
    GB: "United Kingdom",
    JP: "Japan",
    KR: "South Korea",
    IN: "India",
  };

  return labels[iso] ?? iso;
}

function inferRequestedCountryIso(message: string): string | null {
  const normalized = message.toLowerCase();

  if (normalized.includes("canada")) return "CA";
  if (normalized.includes("mexico")) return "MX";
  if (normalized.includes("dominican")) return "DO";
  if (normalized.includes("united kingdom") || normalized.includes(" uk")) return "GB";
  if (normalized.includes("japan")) return "JP";
  if (normalized.includes("south korea") || normalized.includes("korea")) return "KR";
  if (normalized.includes("india")) return "IN";
  if (normalized.includes("united states") || normalized.includes(" usa") || normalized.includes(" us")) return "US";

  return null;
}

function buildProgressCoaching(context: AILearningContext): string {
  const lessonProgress =
    context.completedLessons.length > 0
      ? `You have completed ${context.completedLessons.length} lessons so far.`
      : "You are at the beginning of your learning path.";

  const streakMessage =
    context.sessionStreakDays > 0
      ? `Great consistency — current learning streak signal: ${context.sessionStreakDays} day(s).`
      : "If it has been a while, restart with one short lesson today to rebuild momentum.";

  const nextStep = context.certificationPath
    ? `Certification path focus: ${context.certificationPath}.`
    : "Certification path will appear automatically once a track and level are active.";

  return `${lessonProgress} ${streakMessage} ${nextStep}`;
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
