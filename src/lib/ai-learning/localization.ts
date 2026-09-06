export type AdaptationType =
  | "canonical"
  | "translation"
  | "jurisdiction-adaptation"
  | "comparison";

export type ReviewStatus = "ai-generated" | "needs-review" | "verified";

export interface LessonLocalizationScope {
  lessonId: string;
  displayLanguage: string;
  learningJurisdiction: string;
  sourceJurisdiction: string;
  learnerLocation?: string | null;
  adaptationType: AdaptationType;
}

export interface LocalizationSource {
  title: string;
  url: string;
  publisher?: string;
  accessedAt?: string;
}

export interface LocalizedLessonAnswer {
  message: string;
  suggestions: string[];
  disclaimers: string[];
  milestone: string | null;
  jurisdictionNotes: string[];
  sources: LocalizationSource[];
  reviewStatus: ReviewStatus;
}

const JURISDICTION_NAMES: Record<string, string> = {
  US: "United States", CA: "Canada", DE: "Germany", CH: "Switzerland", AT: "Austria",
  FR: "France", ES: "Spain", PT: "Portugal", BR: "Brazil", NL: "Netherlands",
  PR: "Puerto Rico", UG: "Uganda", KE: "Kenya", TZ: "Tanzania", GB: "United Kingdom",
};

export function normalizeLearningJurisdiction(value: string | null | undefined): string {
  const normalized = value?.trim().toUpperCase();
  if (!normalized) return "";
  if (normalized === "USA" || normalized === "UNITED STATES") return "US";
  if (normalized === "UK" || normalized === "UNITED KINGDOM") return "GB";
  if (normalized === "PUERTO RICO") return "PR";
  return normalized;
}

export function jurisdictionDisplayName(code: string): string {
  const normalized = normalizeLearningJurisdiction(code);
  return normalized ? (JURISDICTION_NAMES[normalized] ?? normalized) : "Unknown jurisdiction";
}

export function buildLessonBoundedLocalizationInstruction(options: {
  scope: LessonLocalizationScope;
  canonicalLesson: string;
  lessonTitle?: string | null;
}): string {
  const { scope, canonicalLesson, lessonTitle } = options;
  const jurisdictionName = jurisdictionDisplayName(scope.learningJurisdiction);
  const sourceJurisdictionName = jurisdictionDisplayName(scope.sourceJurisdiction);
  const jurisdictionKnown = Boolean(normalizeLearningJurisdiction(scope.learningJurisdiction));

  return `You are the Edunancial jurisdiction-aware educational localization engine.

HARD SCOPE — DO NOT EXPAND BEYOND THIS LESSON:
- Lesson ID: ${scope.lessonId}
- Lesson title: ${lessonTitle ?? scope.lessonId}
- Display language: ${scope.displayLanguage}
- Learning jurisdiction selected by the learner: ${jurisdictionName}${scope.learningJurisdiction ? ` (${scope.learningJurisdiction})` : ""}
- Canonical/source jurisdiction: ${sourceJurisdictionName}${scope.sourceJurisdiction ? ` (${scope.sourceJurisdiction})` : ""}
- Adaptation type: ${scope.adaptationType}
${scope.learnerLocation ? `- Learner location signal: ${scope.learnerLocation}` : ""}

CANONICAL LESSON CONTENT:
<<<LESSON_START>>>
${canonicalLesson}
<<<LESSON_END>>>

NON-NEGOTIABLE RULES:
1. The lesson defines the subject boundary. You may localize the lesson, but you may not redefine or broaden the lesson.
2. Identify only the claims, examples, terminology, laws, taxes, institutions, procedures, formulas, rights, obligations, or market practices in this lesson that are jurisdiction-sensitive.
3. Preserve universal concepts when they remain accurate.${jurisdictionKnown ? ` Change only what materially differs in ${jurisdictionName}.` : " The learning jurisdiction is unknown, so teach universal concepts only and do not make local legal, tax, regulatory, employment, property, or institutional claims."}
4. Never infer jurisdiction from language. The selected learning jurisdiction controls substantive law, tax, regulatory, institutional, and market context. The display language controls presentation only.
5. Do not silently substitute source-jurisdiction rules for the learner's jurisdiction. If a jurisdiction-specific fact cannot be verified, say so clearly and keep the explanation at the universal-concept level.
6. For jurisdiction-sensitive claims, prefer current primary or authoritative sources: government, tax authority, central bank, financial regulator, land/property registry, official legislation, court/administrative authority, or similarly authoritative public institution.
7. Do not give individualized financial, legal, tax, accounting, or investment advice. Educational explanation only.
8. Respond entirely in ${scope.displayLanguage} unless a source's official title must remain in its original language.
9. Return concise teaching content tied directly to this lesson. Do not answer unrelated questions even if the learner asks them.
10. Include source URLs for material jurisdiction-specific claims. If no jurisdiction-sensitive adaptation is needed, say that explicitly.

Return a JSON object with exactly these keys:
{
  "message": "2-5 paragraphs teaching this lesson for the selected jurisdiction",
  "suggestions": ["2-3 lesson-bounded follow-up prompts"],
  "disclaimers": ["educational disclaimer when warranted"],
  "milestone": null,
  "jurisdictionNotes": ["brief list of what materially differs from the source jurisdiction"],
  "sources": [{"title":"source title","url":"https://...","publisher":"publisher if known"}],
  "reviewStatus": "ai-generated"
}`;
}

export function isQuestionWithinLessonScope(message: string, lessonText: string, lessonTitle?: string | null): boolean {
  const normalizedMessage = message.toLowerCase().trim();
  if (!normalizedMessage) return false;
  const scopeTerms = `${lessonTitle ?? ""} ${lessonText}`.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((term) => term.length >= 5);
  if (scopeTerms.some((term) => normalizedMessage.includes(term))) return true;
  return /\b(this|lesson|example|explain|here|country|jurisdiction|compare|difference|formula|mean)\b/i.test(normalizedMessage);
}
