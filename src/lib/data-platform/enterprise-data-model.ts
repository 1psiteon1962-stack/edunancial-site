/**
 * Enterprise Data Model Types
 * Central type definitions for the Edunancial data platform.
 * All entities and enumerations are defined here for cross-service consistency.
 */

// ---------------------------------------------------------------------------
// Enumerations
// ---------------------------------------------------------------------------

export type MemberStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "pending_verification"
  | "locked"
  | "archived"
  | "deleted";

export type MembershipTier =
  | "free"
  | "starter"
  | "professional"
  | "enterprise"
  | "lifetime";

export type MembershipStatus =
  | "active"
  | "cancelled"
  | "expired"
  | "paused"
  | "trial"
  | "pending";

export type ContentStatus =
  | "draft"
  | "review"
  | "published"
  | "archived"
  | "deleted";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded"
  | "partially_refunded"
  | "disputed"
  | "cancelled";

export type PaymentProvider =
  | "stripe"
  | "square"
  | "paypal"
  | "bank_transfer"
  | "crypto"
  | "manual";

export type SupportTicketStatus =
  | "open"
  | "in_progress"
  | "pending_user"
  | "resolved"
  | "closed"
  | "escalated";

export type SupportTicketPriority = "low" | "medium" | "high" | "critical";

export type NotificationType = "email" | "sms" | "push" | "in_app" | "webhook";

export type NotificationStatus =
  | "queued"
  | "sent"
  | "delivered"
  | "failed"
  | "bounced"
  | "read";

export type DataClassification =
  | "public"
  | "internal"
  | "confidential"
  | "restricted"
  | "top_secret";

export type AuditAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "export"
  | "import"
  | "approve"
  | "reject"
  | "escalate"
  | "archive"
  | "restore"
  | "access_denied"
  | "permission_change"
  | "config_change";

export type AiInteractionType =
  | "chat"
  | "recommendation"
  | "prediction"
  | "summarization"
  | "personalization"
  | "assessment"
  | "feedback"
  | "search";

export type LifecycleState =
  | "active"
  | "archived"
  | "legal_hold"
  | "pending_deletion"
  | "deleted"
  | "purged";

export type RegionCode = "NA" | "LA" | "EU" | "APAC" | "MENA" | "SSA" | "CARIB";

// ---------------------------------------------------------------------------
// Base Entity
// ---------------------------------------------------------------------------

export interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  updatedAt: Date;
  lifecycleState: LifecycleState;
  dataClassification: DataClassification;
  metadata: Record<string, unknown>;
}

export interface VersionedEntity extends BaseEntity {
  dataVersion: number;
}

// ---------------------------------------------------------------------------
// Member
// ---------------------------------------------------------------------------

export interface Member extends VersionedEntity {
  externalId?: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified: boolean;
  firstName: string;
  lastName: string;
  displayName?: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  gender?: string;
  preferredLanguage: string;
  timezone: string;
  countryCode?: string;
  region?: RegionCode;
  status: MemberStatus;
  gdprConsent: boolean;
  gdprConsentAt?: Date;
  marketingConsent: boolean;
  marketingConsentAt?: Date;
  privacyVersion?: string;
  onboardingCompleted: boolean;
  assessmentCompleted: boolean;
  referralCode?: string;
  referredBy?: string;
  deletedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  sourceSystem: string;
}

// ---------------------------------------------------------------------------
// Membership
// ---------------------------------------------------------------------------

export interface Membership extends VersionedEntity {
  memberId: string;
  tier: MembershipTier;
  status: MembershipStatus;
  startedAt: Date;
  expiresAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  trialEndsAt?: Date;
  autoRenew: boolean;
  paymentMethodId?: string;
  pricePaid?: number;
  currency: string;
  billingCycle?: string;
  region?: RegionCode;
  promotionalCode?: string;
  discountPercent?: number;
}

// ---------------------------------------------------------------------------
// Course
// ---------------------------------------------------------------------------

export interface Course extends VersionedEntity {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnailUrl?: string;
  trailerUrl?: string;
  instructorId?: string;
  category?: string;
  subcategory?: string;
  tags: string[];
  difficultyLevel?: string;
  estimatedHours?: number;
  language: string;
  regionAvailability: string[];
  status: ContentStatus;
  isFree: boolean;
  price?: number;
  currency: string;
  enrollmentCount: number;
  ratingAverage?: number;
  ratingCount: number;
  publishedAt?: Date;
  archivedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  seoTitle?: string;
  seoDescription?: string;
}

// ---------------------------------------------------------------------------
// Lesson
// ---------------------------------------------------------------------------

export interface Lesson extends VersionedEntity {
  courseId: string;
  slug: string;
  title: string;
  description?: string;
  contentType: "video" | "text" | "quiz" | "interactive" | "live";
  videoUrl?: string;
  videoDurationSeconds?: number;
  contentBody?: string;
  sortOrder: number;
  isFreePreview: boolean;
  isRequired: boolean;
  status: ContentStatus;
  publishedAt?: Date;
  createdBy?: string;
}

// ---------------------------------------------------------------------------
// Learning Progress
// ---------------------------------------------------------------------------

export interface CourseEnrollment extends BaseEntity {
  memberId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt?: Date;
  lastAccessedAt?: Date;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  timeSpentSeconds: number;
  certificateEarned: boolean;
  status: "enrolled" | "in_progress" | "completed" | "dropped";
}

export interface LessonProgress extends BaseEntity {
  memberId: string;
  lessonId: string;
  courseId: string;
  status: "not_started" | "in_progress" | "completed" | "skipped";
  progressPercent: number;
  videoPositionSeconds?: number;
  completedAt?: Date;
  lastAccessedAt?: Date;
  attempts: number;
  timeSpentSeconds: number;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Certificate
// ---------------------------------------------------------------------------

export interface Certificate extends BaseEntity {
  certificateNumber: string;
  memberId: string;
  courseId: string;
  enrollmentId?: string;
  studentName: string;
  courseName: string;
  issuedAt: Date;
  expiresAt?: Date;
  revokedAt?: Date;
  revocationReason?: string;
  verificationHash: string;
  templateVersion: string;
}

// ---------------------------------------------------------------------------
// Financial Calculator
// ---------------------------------------------------------------------------

export interface CalculatorSession extends BaseEntity {
  memberId?: string;
  sessionToken: string;
  calculatorType: string;
  inputData: Record<string, unknown>;
  resultData: Record<string, unknown>;
  isSaved: boolean;
  saveName?: string;
  region?: RegionCode;
  currency: string;
  completedAt?: Date;
  expiresAt?: Date;
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

export interface PaymentMethod extends BaseEntity {
  memberId: string;
  provider: PaymentProvider;
  providerMethodId: string;
  type: "card" | "bank_account" | "wallet";
  lastFour?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
  billingAddress?: Record<string, unknown>;
  region?: RegionCode;
  currency: string;
}

export interface Payment extends VersionedEntity {
  memberId: string;
  membershipId?: string;
  paymentMethodId?: string;
  provider: PaymentProvider;
  providerTransactionId?: string;
  amount: number;
  currency: string;
  exchangeRate?: number;
  baseCurrencyAmount?: number;
  status: PaymentStatus;
  description?: string;
  lineItems: PaymentLineItem[];
  taxAmount?: number;
  discountAmount?: number;
  refundedAmount: number;
  failureCode?: string;
  failureMessage?: string;
  region?: RegionCode;
  ipHash?: string;
  processedAt?: Date;
  refundedAt?: Date;
}

export interface PaymentLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sku?: string;
}

// ---------------------------------------------------------------------------
// Support
// ---------------------------------------------------------------------------

export interface SupportTicket extends BaseEntity {
  ticketNumber: string;
  memberId?: string;
  assignedTo?: string;
  subject: string;
  description: string;
  category?: string;
  subcategory?: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  channel: "web" | "email" | "chat" | "phone";
  region?: RegionCode;
  escalatedAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  firstResponseAt?: Date;
  satisfactionScore?: number;
  tags: string[];
}

export interface SupportTicketMessage {
  readonly id: string;
  ticketId: string;
  authorId?: string;
  authorType: "member" | "admin" | "system";
  body: string;
  isInternal: boolean;
  attachments: SupportAttachment[];
  readonly createdAt: Date;
  updatedAt: Date;
}

export interface SupportAttachment {
  fileName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

// ---------------------------------------------------------------------------
// Blog Articles
// ---------------------------------------------------------------------------

export interface BlogArticle extends VersionedEntity {
  slug: string;
  title: string;
  subtitle?: string;
  body?: string;
  excerpt?: string;
  authorId?: string;
  category?: string;
  tags: string[];
  coverImageUrl?: string;
  status: ContentStatus;
  isFeatured: boolean;
  readTimeMinutes?: number;
  viewCount: number;
  regionTargets: string[];
  language: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  publishedAt?: Date;
  archivedAt?: Date;
  createdBy?: string;
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export interface NotificationTemplate {
  readonly id: string;
  name: string;
  type: NotificationType;
  subject?: string;
  bodyTemplate: string;
  variables: string[];
  regionVariants: Record<string, unknown>;
  language: string;
  isActive: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
}

export interface Notification extends BaseEntity {
  memberId: string;
  templateId?: string;
  type: NotificationType;
  channel: string;
  subject?: string;
  body: string;
  status: NotificationStatus;
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  retryCount: number;
  region?: RegionCode;
}

// ---------------------------------------------------------------------------
// Admin Users
// ---------------------------------------------------------------------------

export interface AdminUser {
  readonly id: string;
  memberId?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  permissions: string[];
  regionScope: string[];
  isActive: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  readonly createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  metadata: Record<string, unknown>;
}

export type AdminRole =
  | "super_admin"
  | "admin"
  | "moderator"
  | "support"
  | "analyst"
  | "content_manager";

// ---------------------------------------------------------------------------
// Audit Logs
// ---------------------------------------------------------------------------

export interface AuditLog {
  readonly id: number;
  readonly eventId: string;
  action: AuditAction;
  actorId?: string;
  actorType: "member" | "admin" | "system" | "api";
  actorEmail?: string;
  actorIpHash?: string;
  actorUserAgent?: string;
  entityType: string;
  entityId: string;
  entityVersionBefore?: Record<string, unknown>;
  entityVersionAfter?: Record<string, unknown>;
  description?: string;
  outcome: "success" | "failure" | "partial";
  riskLevel: "low" | "medium" | "high" | "critical";
  region?: RegionCode;
  siteId?: string;
  sessionId?: string;
  requestId?: string;
  dataClassification: DataClassification;
  retentionUntil?: Date;
  readonly createdAt: Date;
  metadata: Record<string, unknown>;
}

export interface CreateAuditLogInput {
  action: AuditAction;
  actorId?: string;
  actorType: "member" | "admin" | "system" | "api";
  actorEmail?: string;
  actorIpHash?: string;
  actorUserAgent?: string;
  entityType: string;
  entityId: string;
  entityVersionBefore?: Record<string, unknown>;
  entityVersionAfter?: Record<string, unknown>;
  description?: string;
  outcome?: "success" | "failure" | "partial";
  riskLevel?: "low" | "medium" | "high" | "critical";
  region?: RegionCode;
  siteId?: string;
  sessionId?: string;
  requestId?: string;
  dataClassification?: DataClassification;
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// AI Interactions
// ---------------------------------------------------------------------------

export interface AiInteraction extends BaseEntity {
  memberId?: string;
  sessionId: string;
  interactionType: AiInteractionType;
  modelId: string;
  modelVersion?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  inputHash?: string;
  outputHash?: string;
  responseTimeMs?: number;
  feedbackScore?: -1 | 0 | 1;
  feedbackText?: string;
  wasHelpful?: boolean;
  errorCode?: string;
  region?: RegionCode;
  expiresAt?: Date;
  contentPolicyCheck: boolean;
  piiDetected: boolean;
  piiRedacted: boolean;
}
