// ─── AI Tutor Types ───────────────────────────────────────────────────────────
// Provider-agnostic type definitions for the enterprise AI Tutor system.

export type MembershipLevel =
  | "free"
  | "basic"
  | "pro"
  | "enterprise";

export type LearningGoal =
  | "budgeting"
  | "investing"
  | "real_estate"
  | "business"
  | "debt_elimination"
  | "retirement"
  | "entrepreneurship"
  | "wealth_building";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type GuardrailCategory =
  | "legal_advice"
  | "tax_advice"
  | "investment_advice"
  | "personalized_financial_advice"
  | "educational";

// ─── Member Context ────────────────────────────────────────────────────────────

export interface MemberProfile {
  userId: string;
  displayName: string;
  membershipLevel: MembershipLevel;
  learningGoals: LearningGoal[];
  preferredLanguage: string;
}

export interface CourseProgress {
  courseId: string;
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  percentComplete: number;
  lastAccessedAt: string;
}

export interface LearningProgress {
  completedCourseIds: string[];
  inProgressCourses: CourseProgress[];
  totalHoursLearned: number;
  currentStreak: number;
  longestStreak: number;
  financialCompetencyScore: number;
}

export interface FinancialToolUsage {
  toolId: string;
  toolName: string;
  lastUsedAt: string;
  useCount: number;
}

export interface MemberContext {
  profile: MemberProfile;
  learningProgress: LearningProgress;
  financialToolsUsed: FinancialToolUsage[];
  sessionGoals: string[];
}

// ─── Chat Types ───────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  citations?: Citation[];
  suggestedResources?: SuggestedResource[];
  guardrailCategory?: GuardrailCategory;
}

export interface Citation {
  id: string;
  title: string;
  url?: string;
  type: "course" | "article" | "calculator" | "external";
}

export interface SuggestedResource {
  id: string;
  title: string;
  type: "course" | "calculator" | "book" | "tool";
  url: string;
  relevanceScore: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  memberContext?: MemberContext;
}

// ─── Learning Path Types ──────────────────────────────────────────────────────

export interface LearningPathStep {
  stepId: string;
  title: string;
  description: string;
  courseId?: string;
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export interface LearningPath {
  pathId: string;
  title: string;
  description: string;
  goal: LearningGoal;
  steps: LearningPathStep[];
  estimatedTotalHours: number;
  difficulty: DifficultyLevel;
  percentComplete: number;
}

export interface CourseRecommendation {
  courseId: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  relevanceScore: number;
  reason: string;
  url: string;
}

export interface CalculatorRecommendation {
  calculatorId: string;
  title: string;
  description: string;
  url: string;
  relevanceScore: number;
  reason: string;
}

// ─── AI Provider Interface ─────────────────────────────────────────────────────

export interface AIProviderConfig {
  provider: "openai" | "anthropic" | "google" | "mock";
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AITutorRequest {
  message: string;
  conversationHistory: ChatMessage[];
  memberContext: MemberContext;
  providerConfig?: AIProviderConfig;
}

export interface AITutorResponse {
  messageId: string;
  content: string;
  guardrailCategory: GuardrailCategory;
  citations: Citation[];
  suggestedResources: SuggestedResource[];
  followUpQuestions: string[];
  escalationRequired: boolean;
  escalationReason?: string;
}
