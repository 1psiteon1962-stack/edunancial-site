export type AITranslationConfig = {
  provider: string;
  apiKey?: string;
  model?: string;
  endpoint?: string;
  defaultSourceLocale?: string;
  defaultTargetLocale?: string;
};

export type TranslationSuggestion = {
  sourceText: string;
  translatedText: string;
  confidence: number;
  rationale?: string;
};

export interface AITranslationService {
  translateText(input: {
    text: string;
    sourceLocale?: string;
    targetLocale: string;
    glossaryId?: string;
  }): Promise<string>;
  translateBatch(input: {
    texts: string[];
    sourceLocale?: string;
    targetLocale: string;
    glossaryId?: string;
  }): Promise<string[]>;
  detectLanguage(text: string): Promise<string>;
  getSuggestions(input: {
    text: string;
    sourceLocale?: string;
    targetLocale: string;
  }): Promise<TranslationSuggestion[]>;
}

export interface TranslationReviewService {
  submitForReview(input: {
    locale: string;
    entityId: string;
    content: string;
    submittedBy: string;
  }): Promise<string>;
  approveTranslation(reviewId: string, reviewer: string): Promise<void>;
  rejectTranslation(reviewId: string, reviewer: string, reason: string): Promise<void>;
  getReviewQueue(locale?: string): Promise<string[]>;
}

export interface TranslationMemoryService {
  lookup(sourceText: string, sourceLocale: string, targetLocale: string): Promise<string | null>;
  store(input: {
    sourceText: string;
    translatedText: string;
    sourceLocale: string;
    targetLocale: string;
    domain?: string;
  }): Promise<void>;
  getSimilar(sourceText: string, locale: string): Promise<string[]>;
}

export interface TerminologyService {
  getTerm(term: string, locale: string): Promise<string | null>;
  addTerm(input: {
    term: string;
    locale: string;
    translation: string;
    definition?: string;
  }): Promise<void>;
  searchTerms(query: string, locale?: string): Promise<string[]>;
}

export function createAITranslationService(
  _config: AITranslationConfig
): AITranslationService {
  throw new Error("AI translation service implementation is not configured.");
}
