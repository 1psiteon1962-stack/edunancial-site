export enum TranslationStatus {
  draft = "draft",
  in_review = "in_review",
  approved = "approved",
  published = "published",
  outdated = "outdated",
}

export type LocalizedContent<T> = Partial<Record<string, T>>;

export type LocalizedSEO = {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
};

export type TranslationEntry<T = string> = {
  locale: string;
  content: T;
  status: TranslationStatus;
  translatedBy: string | null;
  reviewedBy: string | null;
  lastModified: string;
  publishedAt: string | null;
};

export type MultilingualPage<T = string> = {
  slug: string;
  defaultLocale: string;
  translations: Record<string, TranslationEntry<T>>;
  seoByLocale: Record<string, LocalizedSEO>;
};

export type TranslationWorkflowTask = {
  id: string;
  contentType: "page" | "course" | "lesson" | "email" | "notification";
  entityId: string;
  sourceLocale: string;
  targetLocale: string;
  assignee: string | null;
  status: TranslationStatus;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TranslationMemoryEntry = {
  id: string;
  sourceLocale: string;
  targetLocale: string;
  sourceText: string;
  translatedText: string;
  domain: string;
  confidence: number;
  createdAt: string;
  updatedAt: string;
};

export type TerminologyEntry = {
  id: string;
  term: string;
  locale: string;
  translation: string;
  definition: string;
  domain: string;
  approved: boolean;
  notes?: string;
};
