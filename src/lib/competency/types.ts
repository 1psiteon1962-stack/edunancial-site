/**
 * Competency Passport — Shared Types
 *
 * Region-agnostic types used by every EDUNANCIAL global region.
 * Future regions extend these interfaces via RegionPassportAdapter.
 */

// ─── Competency Levels ────────────────────────────────────────────────────────

export type CompetencyLevel =
  | "Student"
  | "Foundation"
  | "Associate"
  | "Professional"
  | "Expert"
  | "Master";

// ─── Area Scores ──────────────────────────────────────────────────────────────

export interface CompetencyAreaScore {
  areaId: string;
  label: string;
  score: number;
  color: string;
}

// ─── Passport Entry ───────────────────────────────────────────────────────────

export interface PassportEntry {
  entryId: string;
  date: string;
  eventType:
    | "assessment"
    | "course_completed"
    | "certificate_earned"
    | "level_up"
    | "achievement_unlocked";
  title: string;
  description: string;
  scoreSnapshot?: number;
  levelSnapshot?: CompetencyLevel;
}

// ─── Certificate ─────────────────────────────────────────────────────────────

export interface PassportCertificate {
  id: string;
  title: string;
  category: string;
  issuedDate: string;
  recipientName: string;
  competencyArea: string;
  score: number;
  downloadUrl: string;
  shareUrl: string;
}

// ─── Achievement ──────────────────────────────────────────────────────────────

export interface PassportAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string | null;
  earned: boolean;
  category: "learning" | "assessment" | "certificate" | "streak" | "level";
}

// ─── Unlock Rules ─────────────────────────────────────────────────────────────

export interface CourseUnlock {
  courseId: string;
  title: string;
  requiredLevel: CompetencyLevel;
  requiredScore: number;
  unlocked: boolean;
  reason?: string;
}

export interface AICoachAccess {
  unlocked: boolean;
  requiredLevel: CompetencyLevel;
  requiredScore: number;
  currentLevel: CompetencyLevel;
  currentScore: number;
  pointsNeeded: number;
}

// ─── Full Passport ────────────────────────────────────────────────────────────

export interface MemberCompetencyPassport {
  memberId: string;
  memberName: string;
  region: string;
  overallScore: number;
  currentLevel: CompetencyLevel;
  nextLevel: CompetencyLevel | null;
  pointsToNextLevel: number;
  areaScores: CompetencyAreaScore[];
  certificates: PassportCertificate[];
  achievements: PassportAchievement[];
  history: PassportEntry[];
  aiCoachAccess: AICoachAccess;
  courseUnlocks: CourseUnlock[];
  completedCourses: number;
  totalCourses: number;
  completionPercentage: number;
}

// ─── Region Adapter Interface ─────────────────────────────────────────────────

export interface RegionPassportConfig {
  regionId: string;
  regionName: string;
  /** Minimum score (0-100) required to unlock the AI Coach. Default: 40 */
  aiCoachUnlockScore: number;
  /** Required level to unlock the AI Coach. Default: "Foundation" */
  aiCoachRequiredLevel: CompetencyLevel;
  /** Course-level overrides per region. */
  courseUnlockOverrides?: Partial<Record<string, number>>;
  /** Custom achievement definitions appended to global set. */
  additionalAchievements?: Omit<PassportAchievement, "earned" | "earnedAt">[];
  /** Base URL for certificate share links, e.g. "https://edunancial.com/certificates" */
  certificateBaseUrl: string;
}
