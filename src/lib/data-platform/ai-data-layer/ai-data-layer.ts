/**
 * AI Data Layer
 * Secure interfaces for recommendation engines, learning analytics,
 * predictive models, AI Tutor, personalization, and ML services.
 * Maintains strict privacy and access controls.
 */

import type { AiInteractionType, DataClassification, RegionCode } from "../enterprise-data-model";

// ---------------------------------------------------------------------------
// AI Service Registry
// ---------------------------------------------------------------------------

export type AiServiceId =
  | "recommendation-engine"
  | "learning-analytics"
  | "predictive-models"
  | "ai-tutor"
  | "personalization"
  | "nlp-search"
  | "content-moderation";

export interface AiServiceDefinition {
  serviceId: AiServiceId;
  serviceName: string;
  description: string;
  interactionType: AiInteractionType;
  requiredScopes: string[];
  dataInputTypes: string[];
  dataOutputTypes: string[];
  piiAccess: boolean;
  piiHandling: "none" | "pseudonymize" | "redact_before_inference";
  modelIds: string[];
  rateLimit: { requestsPerMinute: number; requestsPerDay: number };
  dataClassification: DataClassification;
  gdprLegalBasis: string;
  enabledRegions: RegionCode[];
}

export const AI_SERVICE_REGISTRY: Record<AiServiceId, AiServiceDefinition> = {
  "recommendation-engine": {
    serviceId: "recommendation-engine",
    serviceName: "Course Recommendation Engine",
    description: "Recommends courses based on member learning history and preferences",
    interactionType: "recommendation",
    requiredScopes: ["ai.recommendation.read", "courses.read", "enrollments.read"],
    dataInputTypes: ["member_profile_anonymized", "course_metadata", "enrollment_history"],
    dataOutputTypes: ["course_recommendations"],
    piiAccess: false,
    piiHandling: "pseudonymize",
    modelIds: ["collab-filter-v1", "content-based-v2"],
    rateLimit: { requestsPerMinute: 60, requestsPerDay: 5000 },
    dataClassification: "internal",
    gdprLegalBasis: "legitimate_interest",
    enabledRegions: ["NA", "EU", "LA", "CARIB", "APAC", "MENA", "SSA"],
  },
  "learning-analytics": {
    serviceId: "learning-analytics",
    serviceName: "Learning Analytics Engine",
    description: "Analyzes learning patterns, engagement, and outcomes for insights",
    interactionType: "assessment",
    requiredScopes: ["ai.analytics.read", "enrollments.read", "progress.read"],
    dataInputTypes: ["enrollment_aggregates", "lesson_progress_aggregates", "course_metadata"],
    dataOutputTypes: ["engagement_metrics", "outcome_predictions", "cohort_analysis"],
    piiAccess: false,
    piiHandling: "pseudonymize",
    modelIds: ["learning-outcome-v1"],
    rateLimit: { requestsPerMinute: 30, requestsPerDay: 1000 },
    dataClassification: "internal",
    gdprLegalBasis: "legitimate_interest",
    enabledRegions: ["NA", "EU", "LA", "CARIB"],
  },
  "predictive-models": {
    serviceId: "predictive-models",
    serviceName: "Predictive Analytics Service",
    description: "Predicts churn, LTV, and learning completion likelihood",
    interactionType: "prediction",
    requiredScopes: ["ai.prediction.read", "members.read", "memberships.read", "enrollments.read"],
    dataInputTypes: ["member_feature_vector", "membership_history", "engagement_signals"],
    dataOutputTypes: ["churn_score", "ltv_estimate", "completion_probability"],
    piiAccess: false,
    piiHandling: "pseudonymize",
    modelIds: ["churn-xgb-v1", "ltv-regression-v1", "completion-lstm-v1"],
    rateLimit: { requestsPerMinute: 20, requestsPerDay: 500 },
    dataClassification: "confidential",
    gdprLegalBasis: "legitimate_interest",
    enabledRegions: ["NA", "EU", "LA"],
  },
  "ai-tutor": {
    serviceId: "ai-tutor",
    serviceName: "AI Tutor",
    description: "Conversational AI tutor that answers questions and guides learning",
    interactionType: "chat",
    requiredScopes: ["ai.tutor.read", "courses.read", "lessons.read", "progress.read"],
    dataInputTypes: ["user_message_hashed", "course_context", "lesson_context", "progress_context"],
    dataOutputTypes: ["tutor_response", "suggested_resources"],
    piiAccess: false,
    piiHandling: "redact_before_inference",
    modelIds: ["gpt-edunancial-v1", "llama-finance-v1"],
    rateLimit: { requestsPerMinute: 10, requestsPerDay: 200 },
    dataClassification: "confidential",
    gdprLegalBasis: "contract",
    enabledRegions: ["NA", "EU", "LA", "CARIB"],
  },
  "personalization": {
    serviceId: "personalization",
    serviceName: "Personalization Engine",
    description: "Personalizes content, notifications, and UX based on member behavior",
    interactionType: "personalization",
    requiredScopes: ["ai.personalization.read", "members.read", "enrollments.read"],
    dataInputTypes: ["member_segment", "behavior_signals", "preference_profile"],
    dataOutputTypes: ["content_variant", "notification_timing", "ui_preferences"],
    piiAccess: false,
    piiHandling: "pseudonymize",
    modelIds: ["segment-model-v1", "timing-optimization-v1"],
    rateLimit: { requestsPerMinute: 120, requestsPerDay: 10000 },
    dataClassification: "internal",
    gdprLegalBasis: "legitimate_interest",
    enabledRegions: ["NA", "EU", "LA", "CARIB", "APAC"],
  },
  "nlp-search": {
    serviceId: "nlp-search",
    serviceName: "NLP Search Engine",
    description: "Semantic search over courses, lessons, and financial content",
    interactionType: "search",
    requiredScopes: ["ai.search.read", "courses.read"],
    dataInputTypes: ["search_query_hashed", "course_index", "lesson_index"],
    dataOutputTypes: ["search_results", "semantic_score"],
    piiAccess: false,
    piiHandling: "redact_before_inference",
    modelIds: ["embeddings-v1"],
    rateLimit: { requestsPerMinute: 100, requestsPerDay: 20000 },
    dataClassification: "internal",
    gdprLegalBasis: "legitimate_interest",
    enabledRegions: ["NA", "EU", "LA", "CARIB", "APAC", "MENA", "SSA"],
  },
  "content-moderation": {
    serviceId: "content-moderation",
    serviceName: "Content Moderation Service",
    description: "AI-assisted moderation of user-generated content and support tickets",
    interactionType: "assessment",
    requiredScopes: ["ai.moderation.read", "support.read"],
    dataInputTypes: ["content_text_hashed"],
    dataOutputTypes: ["moderation_decision", "violation_flags"],
    piiAccess: false,
    piiHandling: "redact_before_inference",
    modelIds: ["moderation-classifier-v1"],
    rateLimit: { requestsPerMinute: 200, requestsPerDay: 50000 },
    dataClassification: "internal",
    gdprLegalBasis: "legal_obligation",
    enabledRegions: ["NA", "EU", "LA", "CARIB", "APAC", "MENA", "SSA"],
  },
};

export function getAiService(serviceId: AiServiceId): AiServiceDefinition {
  return AI_SERVICE_REGISTRY[serviceId];
}

// ---------------------------------------------------------------------------
// AI Access Control
// ---------------------------------------------------------------------------

export interface AiAccessContext {
  memberId?: string;
  region: RegionCode;
  membershipTier?: string;
  scopes: string[];
}

export interface AiAccessDecision {
  allowed: boolean;
  reason?: string;
  serviceId: AiServiceId;
}

export function checkAiAccess(
  serviceId: AiServiceId,
  context: AiAccessContext
): AiAccessDecision {
  const service = AI_SERVICE_REGISTRY[serviceId];

  if (!service) {
    return { allowed: false, reason: "Unknown AI service", serviceId };
  }

  if (!service.enabledRegions.includes(context.region)) {
    return {
      allowed: false,
      reason: `AI service "${serviceId}" is not enabled in region "${context.region}"`,
      serviceId,
    };
  }

  const missingScopes = service.requiredScopes.filter(
    (s) => !context.scopes.includes(s)
  );

  if (missingScopes.length > 0) {
    return {
      allowed: false,
      reason: `Missing required scopes: ${missingScopes.join(", ")}`,
      serviceId,
    };
  }

  return { allowed: true, serviceId };
}

// ---------------------------------------------------------------------------
// Privacy-Safe Input Preparation
// ---------------------------------------------------------------------------

export interface AiInputPreparation {
  originalFields: string[];
  redactedFields: string[];
  pseudonymizedFields: string[];
  inputReady: boolean;
  warnings: string[];
}

const PII_FIELD_PATTERNS = [
  /email/i,
  /phone/i,
  /name/i,
  /address/i,
  /date_of_birth/i,
  /ip_address/i,
  /ssn/i,
  /passport/i,
  /credit_card/i,
];

export function isPiiField(fieldName: string): boolean {
  return PII_FIELD_PATTERNS.some((p) => p.test(fieldName));
}

export function prepareAiInput(
  serviceId: AiServiceId,
  inputFields: Record<string, unknown>
): { sanitizedInput: Record<string, unknown>; preparation: AiInputPreparation } {
  const service = AI_SERVICE_REGISTRY[serviceId];
  const preparation: AiInputPreparation = {
    originalFields: Object.keys(inputFields),
    redactedFields: [],
    pseudonymizedFields: [],
    inputReady: true,
    warnings: [],
  };

  const sanitizedInput: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(inputFields)) {
    const pii = isPiiField(key);

    if (!pii) {
      sanitizedInput[key] = value;
      continue;
    }

    if (service.piiHandling === "none") {
      preparation.warnings.push(`PII field "${key}" passed without sanitization (service allows none)`);
      sanitizedInput[key] = value;
    } else if (service.piiHandling === "redact_before_inference") {
      preparation.redactedFields.push(key);
      // Do not include in sanitized input
    } else if (service.piiHandling === "pseudonymize") {
      preparation.pseudonymizedFields.push(key);
      sanitizedInput[`${key}_pseudo`] = `[PSEUDONYMIZED]`;
    }
  }

  if (preparation.redactedFields.length > 0 || preparation.pseudonymizedFields.length > 0) {
    preparation.warnings.push(
      `PII sanitization applied: ${preparation.redactedFields.length} redacted, ` +
      `${preparation.pseudonymizedFields.length} pseudonymized`
    );
  }

  return { sanitizedInput, preparation };
}

// ---------------------------------------------------------------------------
// AI Interaction Builder
// ---------------------------------------------------------------------------

export interface AiInteractionRequest {
  serviceId: AiServiceId;
  memberId?: string;
  sessionId: string;
  modelId: string;
  modelVersion?: string;
  region: RegionCode;
  inputData: Record<string, unknown>;
}

export interface AiInteractionResult {
  success: boolean;
  outputData?: Record<string, unknown>;
  errorCode?: string;
  tokenUsage?: { prompt: number; completion: number; total: number };
  responseTimeMs?: number;
  piiRedacted: boolean;
}

export function buildAiInteractionRecord(
  request: AiInteractionRequest,
  result: AiInteractionResult
): Record<string, unknown> {
  const { sanitizedInput, preparation } = prepareAiInput(request.serviceId, request.inputData);

  return {
    memberId: request.memberId,
    sessionId: request.sessionId,
    interactionType: AI_SERVICE_REGISTRY[request.serviceId].interactionType,
    modelId: request.modelId,
    modelVersion: request.modelVersion,
    promptTokens: result.tokenUsage?.prompt,
    completionTokens: result.tokenUsage?.completion,
    totalTokens: result.tokenUsage?.total,
    responseTimeMs: result.responseTimeMs,
    region: request.region,
    contentPolicyCheck: true,
    piiDetected: preparation.redactedFields.length > 0 || preparation.pseudonymizedFields.length > 0,
    piiRedacted: result.piiRedacted || preparation.redactedFields.length > 0,
    metadata: {
      serviceId: request.serviceId,
      sanitizedFieldCount: Object.keys(sanitizedInput).length,
      warnings: preparation.warnings,
    },
  };
}

// ---------------------------------------------------------------------------
// AI Feature Store (offline features for ML)
// ---------------------------------------------------------------------------

export interface MemberFeatureVector {
  memberIdPseudo: string;
  membershipTier: string;
  region: string;
  enrolledCourseCount: number;
  completedCourseCount: number;
  avgProgressPercent: number;
  totalWatchTimeHours: number;
  daysActiveLast30: number;
  certificateCount: number;
  calculatorSessionCount: number;
  lastActiveAt?: Date;
  cohortMonth: string;
}

export function buildMemberFeatureVector(
  memberIdPseudo: string,
  features: Omit<MemberFeatureVector, "memberIdPseudo">
): MemberFeatureVector {
  return { memberIdPseudo, ...features };
}

export function validateFeatureVector(
  vector: MemberFeatureVector
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!vector.memberIdPseudo) errors.push("memberIdPseudo is required");
  if (vector.avgProgressPercent < 0 || vector.avgProgressPercent > 100) {
    errors.push("avgProgressPercent must be between 0 and 100");
  }
  if (vector.daysActiveLast30 < 0 || vector.daysActiveLast30 > 30) {
    errors.push("daysActiveLast30 must be between 0 and 30");
  }
  if (vector.enrolledCourseCount < 0) errors.push("enrolledCourseCount must be non-negative");
  if (vector.completedCourseCount < 0) errors.push("completedCourseCount must be non-negative");

  return { valid: errors.length === 0, errors };
}
