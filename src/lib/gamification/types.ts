// ─── Core Gamification Types ────────────────────────────────────────────────

// ── Achievement ──────────────────────────────────────────────────────────────

export type AchievementCategory =
  | "onboarding"
  | "learning"
  | "streaks"
  | "finance"
  | "mastery"
  | "community"; // future-ready

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

/** A rule that evaluates whether the achievement has been earned. */
export interface AchievementRule {
  /** Unique key for the condition type. */
  type: string;
  /** Minimum value required to satisfy the rule (e.g. lesson count, streak days). */
  threshold: number;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tier: AchievementTier;
  /** Points awarded when the achievement is first earned. */
  points: number;
  /** Rules evaluated against UserProgress to determine if earned. */
  rules: AchievementRule[];
}

/** Runtime state of a single achievement for a user. */
export interface UserAchievement {
  achievementId: string;
  earned: boolean;
  earnedAt?: string; // ISO-8601
  /** 0–100 progress toward earning (optional visual indicator). */
  progress?: number;
}

// ── Points ────────────────────────────────────────────────────────────────────

export type PointsEventType =
  | "daily_login"
  | "lesson_complete"
  | "quiz_complete"
  | "calculator_use"
  | "course_complete"
  | "certificate_earned"
  | "community_participation"; // future-ready

export interface PointsEvent {
  type: PointsEventType;
  /** Multiplier applied to the base value (default 1). */
  multiplier?: number;
  metadata?: Record<string, unknown>;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  event: PointsEventType;
  points: number;
  createdAt: string; // ISO-8601
  metadata?: Record<string, unknown>;
}

export interface UserPoints {
  userId: string;
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  transactions: PointsTransaction[];
}

// ── Streaks ───────────────────────────────────────────────────────────────────

export interface StreakRecord {
  /** Date in YYYY-MM-DD format. */
  date: string;
  lessonsCompleted: number;
}

export interface UserStreaks {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  weeklyActivity: boolean[]; // 7 booleans, index 0 = Monday
  monthlyActivity: boolean[]; // up to 31 booleans
  lastActivityDate: string | null; // ISO-8601 date
  history: StreakRecord[];
}

// ── Certificates ──────────────────────────────────────────────────────────────

export type CertificateType =
  | "course_completion"
  | "learning_path"
  | "category_mastery"
  | "special_achievement";

export interface CertificateTemplate {
  id: string;
  type: CertificateType;
  name: string;
  description: string;
  /** Slug of the course, path, category, or achievement that triggers issuance. */
  triggerSlug: string;
  /** Whether PDF export is enabled (prepared for future implementation). */
  pdfReady: boolean;
}

export interface UserCertificate {
  id: string;
  userId: string;
  templateId: string;
  studentName: string;
  /** Human-readable credential title. */
  credentialTitle: string;
  issuedAt: string; // ISO-8601
  certificateNumber: string;
  /** Verification URL pattern: /verify/{certificateNumber} */
  verificationUrl: string;
  /** Reserved for future PDF blob or CDN URL. */
  pdfUrl?: string;
}

// ── Leaderboard ───────────────────────────────────────────────────────────────

export type LeaderboardScope =
  | "global"
  | "organization"
  | "friends"
  | "monthly"
  | "all_time";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  points: number;
  achievementCount: number;
  streak: number;
}

export interface LeaderboardConfig {
  enabled: boolean;
  scope: LeaderboardScope;
  maxEntries: number;
  /** Refresh interval in minutes (0 = manual). */
  refreshIntervalMinutes: number;
}

// ── User Progress (aggregate for rule evaluation) ─────────────────────────────

/** Snapshot of a user's activity, used by the achievement engine. */
export interface UserProgress {
  userId: string;
  totalLogins: number;
  coursesStarted: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  calculatorUses: number;
  certificatesEarned: number;
  currentStreak: number;
  longestStreak: number;
  /** Category slugs with completion counts, e.g. { budgeting: 3, credit: 2 } */
  categoryProgress: Record<string, number>;
}
