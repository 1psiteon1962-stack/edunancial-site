import { createAuditLog } from "@/lib/auditLog";
import { getSeoScore, validateSeoReadiness } from "@/lib/content/seo";
import type {
  ContentArticle,
  ContentState,
  EditorialActorRole,
} from "@/lib/content/types";

const TRANSITIONS: Record<ContentState, ContentState[]> = {
  draft: ["inReview"],
  inReview: ["draft", "approved"],
  approved: ["scheduled", "published", "draft"],
  scheduled: ["published", "draft"],
  published: ["archived"],
  archived: ["draft"],
};

const ROLE_CAPABILITIES: Record<EditorialActorRole, ContentState[]> = {
  author: ["inReview"],
  editor: ["draft", "inReview", "approved"],
  seoSpecialist: ["draft", "inReview"],
  factChecker: ["draft", "inReview"],
  legalReviewer: ["draft", "inReview"],
  managingEditor: ["draft", "inReview", "approved", "scheduled", "published", "archived"],
  publisher: ["approved", "scheduled", "published", "archived"],
};

export interface WorkflowTransitionInput {
  article: ContentArticle;
  nextState: ContentState;
  actorName: string;
  actorRole: EditorialActorRole;
  scheduledFor?: string;
}

export interface WorkflowTransitionResult {
  allowed: boolean;
  reasons: string[];
  seoScore: number;
  checklist: ReturnType<typeof validateSeoReadiness>;
  auditLog?: ReturnType<typeof createAuditLog>;
}

export function hasHumanApproval(article: ContentArticle): boolean {
  return article.approvals.length > 0;
}

export function getAvailableWorkflowTargets(
  article: ContentArticle,
  actorRole: EditorialActorRole
): ContentState[] {
  return TRANSITIONS[article.status].filter((nextState) =>
    ROLE_CAPABILITIES[actorRole].includes(nextState)
  );
}

function validatePublicationGuards(
  article: ContentArticle,
  nextState: ContentState,
  scheduledFor?: string
): string[] {
  const reasons: string[] = [];
  const seoScore = getSeoScore(article);

  if ((nextState === "approved" || nextState === "scheduled" || nextState === "published") && !hasHumanApproval(article)) {
    reasons.push("At least one human editorial approval is required before approval or publication steps.");
  }

  if ((nextState === "scheduled" || nextState === "published") && seoScore < 85) {
    reasons.push(`SEO readiness score must be at least 85 before ${nextState}.`);
  }

  if (nextState === "scheduled") {
    if (!scheduledFor) {
      reasons.push("Scheduled content requires a scheduled publication timestamp.");
    } else if (new Date(scheduledFor).getTime() <= Date.now()) {
      reasons.push("Scheduled publication time must be in the future.");
    }
  }

  if (nextState === "published" && article.status !== "approved" && article.status !== "scheduled") {
    reasons.push("Content can only be published from approved or scheduled states.");
  }

  if (nextState === "published" && !article.approvals.some((approval) => approval.role === "publisher" || approval.role === "managingEditor")) {
    reasons.push("A publisher or managing editor approval is required before publication.");
  }

  return reasons;
}

export function evaluateWorkflowTransition(
  input: WorkflowTransitionInput
): WorkflowTransitionResult {
  const { article, nextState, actorName, actorRole, scheduledFor } = input;
  const checklist = validateSeoReadiness(article);
  const seoScore = getSeoScore(article);
  const reasons: string[] = [];

  if (!TRANSITIONS[article.status].includes(nextState)) {
    reasons.push(`Transition from ${article.status} to ${nextState} is not allowed.`);
  }

  if (!ROLE_CAPABILITIES[actorRole].includes(nextState)) {
    reasons.push(`${actorRole} does not have permission to move content to ${nextState}.`);
  }

  reasons.push(...validatePublicationGuards(article, nextState, scheduledFor));

  if (reasons.length > 0) {
    return {
      allowed: false,
      reasons,
      seoScore,
      checklist,
    };
  }

  return {
    allowed: true,
    reasons: [],
    seoScore,
    checklist,
    auditLog: createAuditLog({
      id: `${article.id}-${nextState}`,
      userId: actorName.toLowerCase().replace(/\s+/g, "-"),
      role: actorRole,
      region: "global",
      country: "US",
      action: `transition:${article.status}->${nextState}`,
      entity: "contentArticle",
      entityId: article.id,
      timestamp: new Date().toISOString(),
      ipAddress: "workflow-preview",
    }),
  };
}
