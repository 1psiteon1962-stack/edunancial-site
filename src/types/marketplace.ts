// ─── Professional Services (legacy provider directory) ───────────────────────

export type MarketplaceCategory =
  | "attorney"
  | "accountant"
  | "real-estate"
  | "insurance"
  | "financial-advisor"
  | "tax"
  | "mortgage"
  | "business"
  | "banking";

export interface MarketplaceProvider {
  id: string;
  companyName: string;
  category: MarketplaceCategory;
  country: string;
  state: string;
  city: string;
  languages: string[];
  email: string;
  phone: string;
  website?: string;
  verified: boolean;
  featured: boolean;
}

// ─── Product Marketplace ──────────────────────────────────────────────────────

/** Edunancial educational color-system categories */
export type ProductCategory = "RED" | "WHITE" | "BLUE" | "GENERAL";

/** High-level product classification */
export type ProductType =
  | "education"
  | "merchandise"
  | "digital"
  | "physical"
  | "service"
  | "bundle";

/** Learner experience level */
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

/** Availability / merchandising tags */
export type AvailabilityTag = "new" | "featured" | "best-seller" | "on-sale";

/** BCP-47 language code or short alias */
export type ProductLanguage = "en" | "es" | "fr" | "pt" | "ar" | string;

/** All supported product formats – educational and merchandise */
export type ProductFormat =
  // ── Education ──────────────────────────────────────────────
  | "book"
  | "audiobook"
  | "ebook"
  | "digital-course"
  | "certification"
  | "educational-video"
  | "ai-tool"
  | "guide"
  | "practice-exercise"
  | "workbook"
  | "financial-template"
  | "checklist"
  | "resource-bundle"
  | "case-study"
  | "live-webinar"
  | "workshop"
  | "learning-kit"
  // ── Merchandise ────────────────────────────────────────────
  | "t-shirt"
  | "polo"
  | "hoodie"
  | "jacket"
  | "baseball-cap"
  | "beanie"
  | "coffee-mug"
  | "travel-mug"
  | "water-bottle"
  | "pen"
  | "pencil"
  | "journal"
  | "notebook"
  | "mouse-pad"
  | "tote-bag"
  | "backpack"
  | "laptop-sleeve"
  | "phone-case"
  | "sticker"
  | "magnet"
  | "keychain"
  | "lanyard"
  | "gift-card"
  // ── Services / Future ──────────────────────────────────────
  | "coaching-program"
  | "consulting"
  | "membership-upgrade"
  | "event-ticket"
  | "conference"
  | "partner-product"
  | "affiliate-product"
  | "limited-edition"
  | "seasonal-collection"
  | "premium-bundle";

/** Full product record for the Edunancial Marketplace */
export interface MarketplaceProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;

  // ── Classification ─────────────────────────────────────────
  category: ProductCategory;
  productType: ProductType;
  format: ProductFormat;

  // ── Education-specific ─────────────────────────────────────
  level?: ExperienceLevel;
  learningObjectives?: string[];
  completionTime?: string;
  difficulty?: ExperienceLevel;

  // ── Commerce ───────────────────────────────────────────────
  price: number;
  originalPrice?: number;
  currency: string;

  // ── Availability ───────────────────────────────────────────
  availability: AvailabilityTag[];
  inStock: boolean;

  // ── Media ──────────────────────────────────────────────────
  imageUrl: string;
  imageAlt: string;

  // ── Metadata ───────────────────────────────────────────────
  languages: ProductLanguage[];
  isDigital: boolean;
  isPhysical: boolean;

  // ── Relations ──────────────────────────────────────────────
  relatedProductIds?: string[];
  tags?: string[];

  // ── Regional readiness ─────────────────────────────────────
  /** Region codes, or ["ALL"] for worldwide availability */
  availableRegions?: string[];

  // ── Product detail page content ────────────────────────────
  faqs?: Array<{ question: string; answer: string }>;
  reviewCount?: number;
  rating?: number;

  /** Merchandise specifications (size, material, color options, etc.) */
  specifications?: Record<string, string>;
}

// ─── Category configuration ───────────────────────────────────────────────────

export type MerchandiseCategory =
  | "apparel"
  | "headwear"
  | "drinkware"
  | "stationery"
  | "accessories"
  | "tech"
  | "gift";

export interface ShopCategory {
  id: string;
  name: string;
  slug: string;
  category: MerchandiseCategory;
  description: string;
  productCount: number;
}

export interface LearnCategory {
  id: string;
  name: string;
  slug: string;
  color: "RED" | "WHITE" | "BLUE";
  colorHex: string;
  description: string;
  subtitle: string;
}

// ─── Filter types ────────────────────────────────────────────────────────────

export interface MarketplaceFilters {
  category?: ProductCategory | "";
  productType?: ProductType | "";
  level?: ExperienceLevel | "";
  availability?: AvailabilityTag | "";
  language?: ProductLanguage | "";
  search?: string;
}
