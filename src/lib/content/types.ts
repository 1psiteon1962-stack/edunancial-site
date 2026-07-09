export const CONTENT_STATES = [
  "draft",
  "inReview",
  "approved",
  "scheduled",
  "published",
  "archived",
] as const;

export type ContentState = (typeof CONTENT_STATES)[number];

export type EditorialActorRole =
  | "author"
  | "editor"
  | "seoSpecialist"
  | "factChecker"
  | "legalReviewer"
  | "managingEditor"
  | "publisher";

export const AI_SUGGESTION_TYPES = [
  "outline",
  "seoRecommendations",
  "readabilityAnalysis",
  "grammarSuggestions",
  "internalLinkSuggestions",
  "metaTitle",
  "metaDescription",
  "faqGeneration",
  "contentSummary",
] as const;

export type AISuggestionType = (typeof AI_SUGGESTION_TYPES)[number];

export interface ContentCategory {
  slug: string;
  name: string;
  summary: string;
  clusterSlug: string;
  priority: number;
}

export interface TopicCluster {
  slug: string;
  name: string;
  summary: string;
  entityFocus: string[];
}

export interface AuthorProfile {
  slug: string;
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  credentials: string[];
  locale: string;
}

export interface EditorialCollaborator {
  id: string;
  name: string;
  role: EditorialActorRole;
}

export interface PublicationHistoryEntry {
  state: ContentState;
  changedAt: string;
  changedBy: string;
  note: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  summary: string;
  body: string[];
  entityFocus: string[];
}

export interface SEOFields {
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  ogImage: string;
  keywords: string[];
  educationalLevel: string;
}

export interface PerformanceSnapshot {
  views30Days: number;
  avgEngagedMinutes: number;
  conversions30Days: number;
  trendingScore: number;
}

export interface EditorialApproval {
  role: Extract<EditorialActorRole, "editor" | "legalReviewer" | "publisher" | "managingEditor">;
  reviewer: string;
  approvedAt: string;
  note: string;
}

export interface AIReviewItem {
  id: string;
  type: AISuggestionType;
  title: string;
  summary: string;
  content: string;
  status: "pending" | "accepted" | "edited";
  editable: boolean;
}

export interface ContentArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: ContentState;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledFor?: string;
  archivedAt?: string;
  authorSlug: string;
  categorySlug: string;
  secondaryCategorySlugs: string[];
  clusterSlug: string;
  tags: string[];
  audience: string[];
  entityHighlights: string[];
  featured: boolean;
  collaborators: EditorialCollaborator[];
  approvals: EditorialApproval[];
  publicationHistory: PublicationHistoryEntry[];
  sections: ArticleSection[];
  faq: FAQItem[];
  summary: string;
  seo: SEOFields;
  performance: PerformanceSnapshot;
  relatedSlugs?: string[];
  locale: string;
  translationGroupId: string;
  personalizationTags: string[];
}

export interface ContentSearchFilters {
  query?: string;
  category?: string;
  tag?: string;
  author?: string;
  cluster?: string;
  featured?: boolean;
  trending?: boolean;
}

export interface SeoChecklistItem {
  label: string;
  passed: boolean;
  detail: string;
}
