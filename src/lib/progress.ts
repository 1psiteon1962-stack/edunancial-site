import type { StudentProgressDatabaseRecord } from "@/lib/adaptive-learning";

const ADAPTIVE_LEARNING_STORAGE_KEY = "adaptive-learning-progress";

export function saveProgress(packId: string, completed: string[]) {
  localStorage.setItem(`progress-${packId}`, JSON.stringify(completed));
}

export function loadProgress(packId: string): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const value = localStorage.getItem(`progress-${packId}`);

  if (!value) {
    return [];
  }

  return JSON.parse(value);
}

export function saveAdaptiveLearningProgress(progress: StudentProgressDatabaseRecord) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(ADAPTIVE_LEARNING_STORAGE_KEY, JSON.stringify(progress));
}

export function loadAdaptiveLearningProgress(): StudentProgressDatabaseRecord | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = localStorage.getItem(ADAPTIVE_LEARNING_STORAGE_KEY);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as StudentProgressDatabaseRecord;
}
