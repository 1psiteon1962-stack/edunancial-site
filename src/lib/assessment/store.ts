import { AssessmentAnswer } from "./scoring";

const STORAGE_KEY = "fcas_answers";
const RESULTS_KEY = "fcas_results";

export interface StoredAnswers {
  [questionId: string]: "A" | "B" | "C" | "D";
}

export interface StoredResults {
  completedAt: string;
  overall: number;
  personalFinance: number;
  investing: number;
  realEstate: number;
  business: number;
  riskManagement: number;
  financialProfile: number;
}

export function saveAnswersForSection(
  answers: StoredAnswers
): void {
  if (typeof window === "undefined") return;
  const existing = loadAllRawAnswers();
  const merged = { ...existing, ...answers };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function loadAllRawAnswers(): StoredAnswers {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredAnswers;
  } catch {
    return {};
  }
}

export function buildAssessmentAnswers(
  raw: StoredAnswers,
  sectionMap: Record<string, import("./scoring").CompetencyArea>
): AssessmentAnswer[] {
  return Object.entries(raw)
    .filter(([id, answer]) => {
      const area = sectionMap[id];
      return (
        area !== undefined &&
        ["A", "B", "C", "D"].includes(answer)
      );
    })
    .map(([questionId, answer]) => ({
      area: sectionMap[questionId],
      questionId,
      answer: answer as "A" | "B" | "C" | "D",
    }));
}

export function clearAssessmentAnswers(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(RESULTS_KEY);
}

export function saveResults(results: StoredResults): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

export function loadResults(): StoredResults | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredResults;
  } catch {
    return null;
  }
}

export function answeredCount(raw: StoredAnswers): number {
  return Object.keys(raw).length;
}
