import type { EdunancialPillar, TopLevelClassification } from "@/lib/admin-content/types";

export const PILLAR_KEYWORDS: Record<EdunancialPillar, string[]> = {
  red: ["real estate", "real-estate", "tax lien", "tax deed", "foreclosure", "flipping", "creative financing", "property"],
  white: ["paper assets", "stocks", "options", "bonds", "retirement", "commercial credit", "credit"],
  blue: ["business", "entrepreneurship", "profit", "margins", "ai", "artificial intelligence", "operations"],
  green: ["tax", "taxes", "taxation", "tax code", "deduction", "deductions", "tax planning"],
  gold: ["investing", "investment", "wealth", "wealth building", "portfolio", "asset allocation", "investor"],
  purple: ["law", "legal", "contract", "contracts", "entity", "entities", "asset protection"],
  orange: ["sales", "marketing", "advertising", "branding", "lead generation", "customer acquisition", "conversion"],
  black: ["leadership", "executive", "management", "governance", "strategy", "delegation", "ceo"],
  academy: ["academy", "level 1", "level 2", "level 3", "level 4", "level 5"],
  uncategorized: [],
};

export const CATEGORY_KEYWORDS: Record<TopLevelClassification, string[]> = {
  books: ["book", "ebook", "guide", "manual"],
  courses: ["course", "module", "cohort"],
  lessons: ["lesson", "lecture", "worksheet"],
  quizzes: ["quiz", "exam", "assessment", "test"],
  certificates: ["certificate", "badge"],
  legal: ["legal", "contract", "policy", "privacy", "terms"],
  membership: ["membership", "subscriber", "onboarding"],
  marketing: ["marketing", "campaign", "sales", "landing page"],
  "social-media": ["social", "facebook", "instagram", "tiktok", "linkedin", "youtube"],
  "frequently-asked-questions": ["faq", "frequently asked questions"],
  translations: ["translation", "translated", "localized", "espanol", "francais", "canadien"],
  audio: ["audio", "podcast"],
  video: ["video", "webinar", "lesson recording"],
  images: ["image", "graphic", "cover", "screenshot"],
  uncategorized: [],
};
