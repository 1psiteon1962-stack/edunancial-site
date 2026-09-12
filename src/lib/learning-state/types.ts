export interface LearnerResumeState {
  userId: string;
  trackCode: string | null;
  levelCode: string | null;
  lessonId: string | null;
  lessonProgressPercent: number;
  lastPositionSeconds: number;
  language: string;
  jurisdiction: string;
  subdivisionCode?: string;
  updatedAt: string;
}

export interface SavedLearningItem {
  id: string;
  userId: string;
  lessonId: string;
  kind: 'bookmark' | 'note' | 'question';
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningStateRepository {
  getResumeState(userId: string): Promise<LearnerResumeState | null>;
  saveResumeState(state: LearnerResumeState): Promise<void>;
  listSavedItems(userId: string): Promise<SavedLearningItem[]>;
  saveItem(item: SavedLearningItem): Promise<void>;
  deleteSavedItem(userId: string, id: string): Promise<void>;
}

/**
 * Progress is curriculum identity, not presentation identity. A language or
 * jurisdiction change must not reset completed lessons or the learner's place.
 */
export function sameCurriculumPosition(a: LearnerResumeState, b: LearnerResumeState): boolean {
  return a.trackCode === b.trackCode && a.levelCode === b.levelCode && a.lessonId === b.lessonId;
}
