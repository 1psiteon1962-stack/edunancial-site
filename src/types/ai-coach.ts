// AI Financial Coach & Personalized Learning Platform – shared types
// Designed for future database/auth integration; no hard-coded secrets.

// ─── Competency ────────────────────────────────────────────────────────────

export type CompetencyArea =
  | "personalFinance"
  | "investing"
  | "realEstate"
  | "business"
  | "riskManagement"
  | "financialProfile";

export interface CompetencyScores {
  overall: number;
  personalFinance: number;
  investing: number;
  realEstate: number;
  business: number;
  riskManagement: number;
  financialProfile: number;
}

export type CompetencyLevel =
  | "Beginner"
  | "Developing"
  | "Competent"
  | "Proficient"
  | "Expert";

// ─── Financial Goals ────────────────────────────────────────────────────────

export type GoalCategory =
  | "savings"
  | "debt"
  | "investment"
  | "retirement"
  | "homeOwnership"
  | "businessOwnership"
  | "custom";

export type GoalStatus = "notStarted" | "inProgress" | "onTrack" | "atRisk" | "completed";

export interface FinancialGoal {
  id: string;
  memberId: string;
  title: string;
  category: GoalCategory;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // ISO date
  startDate: string;
  status: GoalStatus;
  currency: string;
  milestones: GoalMilestone[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  targetAmount: number;
  completedAt?: string;
}

export interface GoalProgress {
  goal: FinancialGoal;
  percentComplete: number;
  amountRemaining: number;
  daysRemaining: number;
  isOnTrack: boolean;
  projectedCompletionDate: string;
  weeklyRequired: number;
}

// ─── Recommendations ────────────────────────────────────────────────────────

export type RecommendationType =
  | "course"
  | "book"
  | "article"
  | "video"
  | "marketplaceProduct"
  | "assessment"
  | "action";

export type RecommendationPriority = "critical" | "high" | "medium" | "low";

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  reason: string;
  confidenceScore: number; // 0–100
  priority: RecommendationPriority;
  category: string;
  actionUrl?: string;
  thumbnailUrl?: string;
  estimatedTimeMinutes?: number;
  tags: string[];
  createdAt: string;
}

export interface RecommendationContext {
  competencyScores?: CompetencyScores;
  completedCourseIds?: string[];
  goalCategories?: GoalCategory[];
  membershipLevel?: string;
  assessmentCompleted?: boolean;
  learningHistory?: string[];
}

// ─── Learning ───────────────────────────────────────────────────────────────

export type ContentType = "course" | "book" | "article" | "video" | "audio";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface LearningItem {
  id: string;
  type: ContentType;
  title: string;
  category: CompetencyArea | string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  description: string;
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  isFree: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: CompetencyArea | string;
  difficulty: DifficultyLevel;
  steps: LearningPathStep[];
  estimatedHours: number;
  competencyAward: string;
  isAdaptive: boolean;
}

export interface LearningPathStep {
  order: number;
  item: LearningItem;
  isCompleted: boolean;
  isUnlocked: boolean;
  completedAt?: string;
}

export interface LearningHistory {
  memberId: string;
  completedItems: CompletedLearningItem[];
  totalMinutes: number;
  currentStreak: number; // days
  longestStreak: number;
  lastActivityAt: string;
}

export interface CompletedLearningItem {
  itemId: string;
  type: ContentType;
  completedAt: string;
  score?: number;
}

// ─── Notifications ─────────────────────────────────────────────────────────

export type NotificationCategory =
  | "dailyReminder"
  | "weeklyReport"
  | "goalMilestone"
  | "courseReminder"
  | "assessmentReminder"
  | "achievement"
  | "system";

export type NotificationPriority = "low" | "medium" | "high";

export interface AINotification {
  id: string;
  memberId: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  isRead: boolean;
  isDismissed: boolean;
  scheduledFor?: string;
  createdAt: string;
}

// ─── Insights ──────────────────────────────────────────────────────────────

export interface MemberInsight {
  strengths: InsightItem[];
  weaknesses: InsightItem[];
  trends: CompetencyTrend[];
  suggestions: ImprovementSuggestion[];
  historicalScores: HistoricalScore[];
}

export interface InsightItem {
  area: CompetencyArea;
  label: string;
  score: number;
  note: string;
}

export interface CompetencyTrend {
  area: CompetencyArea;
  label: string;
  direction: "improving" | "declining" | "stable";
  changePercent: number;
}

export interface ImprovementSuggestion {
  id: string;
  area: CompetencyArea;
  suggestion: string;
  priority: RecommendationPriority;
  estimatedImpact: string;
}

export interface HistoricalScore {
  date: string;
  overallScore: number;
  areas: Partial<CompetencyScores>;
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

export interface AICoachDashboardData {
  memberName: string;
  membershipLevel: string;
  aiCoachEnabled: boolean;
  competencyScores: CompetencyScores | null;
  competencyLevel: CompetencyLevel;
  goals: GoalProgress[];
  topRecommendations: Recommendation[];
  nextActions: NextAction[];
  recentNotifications: AINotification[];
  learningHistory: LearningHistory | null;
  achievements: Achievement[];
  assessmentCompleted: boolean;
}

export interface NextAction {
  id: string;
  title: string;
  description: string;
  type: "course" | "goal" | "assessment" | "action";
  priority: RecommendationPriority;
  estimatedMinutes: number;
  actionUrl: string;
  dueDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: string;
}

// ─── Audit ─────────────────────────────────────────────────────────────────

export interface AICoachAuditEvent {
  id: string;
  memberId: string;
  action:
    | "VIEW_DASHBOARD"
    | "CREATE_GOAL"
    | "UPDATE_GOAL"
    | "DELETE_GOAL"
    | "VIEW_RECOMMENDATIONS"
    | "VIEW_INSIGHTS"
    | "DISMISS_NOTIFICATION"
    | "START_LEARNING_PATH"
    | "COMPLETE_LEARNING_ITEM";
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}
