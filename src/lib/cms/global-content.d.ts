export type CmsActor = { userId: string; role: string };
export type CmsLesson = Record<string, unknown>;
export type CmsDashboard = {
  totalLessons: number;
  published: number;
  draft: number;
  needsReview: number;
  needsTranslation: number;
  missingLocalization: number;
  recentlyUpdated: Array<{ lessonId: string; title: string; updatedAt: string }>;
  recentActivity: Array<{ timestamp: string; action: string; actor?: string; lessonId?: string; mediaId?: string }>;
  pendingApprovals: number;
};

export const CMS_ROLES: string[];
export const WORKFLOW_STATES: string[];

export function createDefaultCmsState(): Record<string, unknown>;
export function hasPermission(role: string, action: string): boolean;

export function createInMemoryCmsEngine(initialState?: Record<string, unknown>): {
  getState(): Record<string, unknown>;
  getDashboard(): CmsDashboard;
  createLesson(input: Record<string, unknown>, actor: CmsActor): CmsLesson;
  editLesson(lessonId: string, updates: Record<string, unknown>, actor: CmsActor): CmsLesson;
  rollbackLesson(lessonId: string, targetVersion: number, actor: CmsActor): CmsLesson;
  assignRole(lessonId: string, assignmentKey: string, assignee: unknown, actor: CmsActor): CmsLesson;
  transitionStatus(lessonId: string, status: string, actor: CmsActor): CmsLesson;
  publishLesson(lessonId: string, actor: CmsActor): CmsLesson;
  archiveLesson(lessonId: string, actor: CmsActor): CmsLesson;
  restoreLesson(lessonId: string, actor: CmsActor): CmsLesson;
  lockLesson(lessonId: string, actor: CmsActor): Record<string, unknown>;
  unlockLesson(lessonId: string, actor: CmsActor): boolean;
  uploadMedia(input: Record<string, unknown>, actor: CmsActor): Record<string, unknown>;
  getMedia(actor?: CmsActor): Record<string, unknown>[];
  getLesson(lessonId: string, actor: CmsActor): CmsLesson;
  getVersionHistory(lessonId: string, actor: CmsActor): Record<string, unknown>[];
  getLocalization(lessonId: string, actor: CmsActor): Record<string, unknown>;
  listLessons(query: Record<string, unknown>, actor: CmsActor): CmsLesson[];
};

export function createFileBackedCmsEngine(): ReturnType<typeof createInMemoryCmsEngine>;
