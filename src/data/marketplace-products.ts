/**
 * Edunancial Marketplace — Sample product data
 *
 * Architecture notes:
 * - Static/sample data for now; replace with API/CMS calls when backend is ready.
 * - All product IDs are stable slugs suitable for use as URL segments.
 * - availableRegions: ["ALL"] means worldwide; restrict to region codes when needed.
 * - productType + format drive UI rendering (Learn vs Shop sections, filter logic).
 */

import type {
  LearnCategory,
  MarketplaceProduct,
  ShopCategory,
} from "@/types/marketplace";

// ─── Learn categories (Edunancial color system) ───────────────────────────────

export const LEARN_CATEGORIES: LearnCategory[] = [
  {
    id: "red",
    name: "RED",
    slug: "red",
    color: "RED",
    colorHex: "#dc2626",
    description: "Real Estate",
    subtitle:
      "Tax liens, tax deeds, rental properties, commercial real estate, and housing affordability.",
  },
  {
    id: "white",
    name: "WHITE",
    slug: "white",
    color: "WHITE",
    colorHex: "#e2e8f0",
    description: "Paper Assets",
    subtitle:
      "Stocks, bonds, options, ETFs, index funds, and financial statement literacy.",
  },
  {
    id: "blue",
    name: "BLUE",
    slug: "blue",
    color: "BLUE",
    colorHex: "#2563eb",
    description: "Business",
    subtitle:
      "Entrepreneurship, profitability, systems, management, scaling, and business finance.",
  },
];

// ─── Shop categories (branded merchandise) ────────────────────────────────────

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    id: "apparel",
    name: "Apparel",
    slug: "apparel",
    category: "apparel",
    description: "T-Shirts, Polo Shirts, Hoodies, and Jackets",
    productCount: 4,
  },
  {
    id: "headwear",
    name: "Headwear",
    slug: "headwear",
    category: "headwear",
    description: "Baseball Caps and Beanies",
    productCount: 2,
  },
  {
    id: "drinkware",
    name: "Drinkware",
    slug: "drinkware",
    category: "drinkware",
    description: "Coffee Mugs, Travel Mugs, and Water Bottles",
    productCount: 3,
  },
  {
    id: "stationery",
    name: "Stationery",
    slug: "stationery",
    category: "stationery",
    description: "Pens, Pencils, Journals, and Notebooks",
    productCount: 4,
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    category: "accessories",
    description: "Keychains, Lanyards, Magnets, Stickers, and Mouse Pads",
    productCount: 5,
  },
  {
    id: "tech",
    name: "Tech & Bags",
    slug: "tech",
    category: "tech",
    description: "Tote Bags, Backpacks, Laptop Sleeves, and Phone Cases",
    productCount: 4,
  },
  {
    id: "gift",
    name: "Gift Cards",
    slug: "gift",
    category: "gift",
    description: "Edunancial Gift Cards for any occasion",
    productCount: 1,
  },
];

// ─── Sample products ──────────────────────────────────────────────────────────

export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  // ════════════════════════════════════════════
  //  LEARN — RED (Real Estate)
  // ════════════════════════════════════════════
  {
    id: "tax-liens-tax-deeds-book",
    slug: "tax-liens-tax-deeds-book",
    name: "Building Wealth with Tax Liens & Tax Deeds",
    shortDescription:
      "Master tax lien certificates, tax deeds, acquisition strategies, and wealth-building in real estate.",
    description:
      "A comprehensive guide to one of the most overlooked real estate investment strategies available to everyday investors. Learn how to acquire tax lien certificates, navigate tax deed auctions, evaluate properties, manage risk, and build lasting wealth through disciplined real estate action.",
    category: "RED",
    productType: "education",
    format: "book",
    level: "beginner",
    difficulty: "beginner",
    learningObjectives: [
      "Understand how tax lien and tax deed investing works",
      "Navigate county auction processes",
      "Evaluate risk and return on lien investments",
      "Build a portfolio of tax lien certificates",
    ],
    completionTime: "8–12 hours",
    price: 24.99,
    currency: "USD",
    availability: ["featured", "best-seller"],
    inStock: true,
    imageUrl: "/images/marketplace/tax-liens-book.jpg",
    imageAlt: "Building Wealth with Tax Liens & Tax Deeds book cover",
    languages: ["en", "es"],
    isDigital: false,
    isPhysical: true,
    availableRegions: ["ALL"],
    tags: ["real-estate", "tax-liens", "tax-deeds", "investing"],
    rating: 4.8,
    reviewCount: 142,
    faqs: [
      {
        question: "Is this book available as an eBook?",
        answer:
          "Yes, the eBook edition is available separately in the Marketplace.",
      },
      {
        question: "What countries does this apply to?",
        answer:
          "Tax lien investing is primarily a U.S. strategy. International chapters discuss comparable instruments in other markets.",
      },
    ],
    specifications: {
      Pages: "320",
      Format: "Hardcover / Paperback",
      Language: "English / Spanish",
      Publisher: "Edunancial Publishing",
    },
  },
  {
    id: "options-trading-book",
    slug: "options-trading-book",
    name: "Options Trading: Fundamentals to Strategy",
    shortDescription:
      "Learn calls, puts, spreads, risk management, and disciplined options investing.",
    description:
      "A practical, step-by-step guide to options trading built for financial education rather than speculation. Covers foundational mechanics, common strategies, risk management principles, and how options fit into a broader wealth-building plan.",
    category: "WHITE",
    productType: "education",
    format: "book",
    level: "intermediate",
    difficulty: "intermediate",
    learningObjectives: [
      "Understand call and put options mechanics",
      "Learn covered calls, protective puts, and spreads",
      "Manage risk using defined-risk strategies",
      "Integrate options into a diversified portfolio",
    ],
    completionTime: "10–15 hours",
    price: 24.99,
    currency: "USD",
    availability: ["featured"],
    inStock: true,
    imageUrl: "/images/marketplace/options-trading-book.jpg",
    imageAlt: "Options Trading book cover",
    languages: ["en", "es"],
    isDigital: false,
    isPhysical: true,
    availableRegions: ["ALL"],
    tags: ["options", "investing", "stocks", "paper-assets"],
    rating: 4.7,
    reviewCount: 98,
    faqs: [
      {
        question: "Do I need prior investing experience?",
        answer:
          "Basic stock market familiarity is helpful but not required. The book starts from foundational concepts.",
      },
    ],
    specifications: {
      Pages: "280",
      Format: "Hardcover / Paperback",
      Language: "English / Spanish",
      Publisher: "Edunancial Publishing",
    },
  },
  {
    id: "business-profit-book",
    slug: "business-profit-book",
    name: "Business Is About Making Profit",
    shortDescription:
      "Understand why profit — not revenue — is the foundation of business survival and growth.",
    description:
      "A practical guide to entrepreneurship and business finance that cuts through the noise. Learn how to read financial statements, manage cash flow, price products for profitability, build repeatable systems, and scale sustainably.",
    category: "BLUE",
    productType: "education",
    format: "book",
    level: "beginner",
    difficulty: "beginner",
    learningObjectives: [
      "Distinguish between revenue and profit",
      "Read and interpret income statements and balance sheets",
      "Price products and services for sustainable margins",
      "Build systems that scale without burning out",
    ],
    completionTime: "6–10 hours",
    price: 19.99,
    currency: "USD",
    availability: ["best-seller", "featured"],
    inStock: true,
    imageUrl: "/images/marketplace/business-profit-book.jpg",
    imageAlt: "Business Is About Making Profit book cover",
    languages: ["en", "es"],
    isDigital: false,
    isPhysical: true,
    relatedProductIds: ["business-profit-ebook"],
    availableRegions: ["ALL"],
    tags: ["business", "entrepreneurship", "profit", "finance"],
    rating: 4.9,
    reviewCount: 211,
    faqs: [
      {
        question: "Is there an audiobook version?",
        answer: "An audiobook edition is in production and coming soon.",
      },
      {
        question: "Is this suitable for someone starting a business?",
        answer:
          "Absolutely. It is written for aspiring and early-stage entrepreneurs who want a practical foundation.",
      },
    ],
    specifications: {
      Pages: "240",
      Format: "Hardcover / Paperback",
      Language: "English / Spanish",
      Publisher: "Edunancial Publishing",
    },
  },
  {
    id: "business-profit-ebook",
    slug: "business-profit-ebook",
    name: "Business Is About Making Profit (eBook)",
    shortDescription:
      "Instant digital access to the Edunancial business fundamentals guide.",
    description:
      "The complete digital edition of Business Is About Making Profit. Read on any device, anywhere in the world. Includes all original content, exercises, and frameworks.",
    category: "BLUE",
    productType: "digital",
    format: "ebook",
    level: "beginner",
    difficulty: "beginner",
    learningObjectives: [
      "Distinguish between revenue and profit",
      "Read and interpret income statements and balance sheets",
      "Price products and services for sustainable margins",
    ],
    completionTime: "6–10 hours",
    price: 9.99,
    currency: "USD",
    availability: ["featured"],
    inStock: true,
    imageUrl: "/images/marketplace/business-profit-ebook.jpg",
    imageAlt: "Business Is About Making Profit eBook cover",
    languages: ["en", "es"],
    isDigital: true,
    isPhysical: false,
    relatedProductIds: ["business-profit-book"],
    availableRegions: ["ALL"],
    tags: ["business", "entrepreneurship", "profit", "ebook"],
    rating: 4.9,
    reviewCount: 87,
  },
  {
    id: "wealth-building-rwb-book",
    slug: "wealth-building-rwb-book",
    name: "Wealth Building the RED, WHITE & BLUE Way",
    shortDescription:
      "The foundational Edunancial guide to building wealth across real estate, paper assets, and business.",
    description:
      "The cornerstone of the Edunancial education system. Learn how real estate (RED), paper assets (WHITE), and business (BLUE) work together as a coordinated wealth-building strategy. Understand which asset classes suit your situation and how to begin building competency in each.",
    category: "GENERAL",
    productType: "education",
    format: "book",
    level: "beginner",
    difficulty: "beginner",
    learningObjectives: [
      "Understand the RED, WHITE, and BLUE wealth-building framework",
      "Identify which asset classes match your goals and risk tolerance",
      "Build a personal wealth-building roadmap",
      "Develop financial literacy across all three systems",
    ],
    completionTime: "8–12 hours",
    price: 24.99,
    currency: "USD",
    availability: ["featured", "best-seller", "new"],
    inStock: true,
    imageUrl: "/images/marketplace/wealth-building-rwb.jpg",
    imageAlt: "Wealth Building the RED WHITE BLUE Way book cover",
    languages: ["en", "es"],
    isDigital: false,
    isPhysical: true,
    availableRegions: ["ALL"],
    tags: ["foundations", "wealth-building", "red", "white", "blue"],
    rating: 5.0,
    reviewCount: 304,
    faqs: [
      {
        question: "Is this book for beginners?",
        answer:
          "Yes. It is designed as the first book in the Edunancial system and requires no prior financial education.",
      },
      {
        question: "What languages is it available in?",
        answer:
          "Currently available in English and Spanish. Additional languages are in development.",
      },
    ],
    specifications: {
      Pages: "360",
      Format: "Hardcover / Paperback",
      Language: "English / Spanish",
      Publisher: "Edunancial Publishing",
    },
  },
  {
    id: "financial-competency-book",
    slug: "financial-competency-book",
    name: "Financial Competency",
    shortDescription:
      "Build the practical financial skills and habits needed to make sound decisions every day.",
    description:
      "Financial literacy provides the foundation, but financial competency is built through disciplined action. This book bridges the gap between knowledge and confident real-world application — covering budgeting, debt management, investing principles, and building financial independence.",
    category: "GENERAL",
    productType: "education",
    format: "book",
    level: "beginner",
    difficulty: "beginner",
    learningObjectives: [
      "Distinguish financial literacy from financial competency",
      "Build a personal budget and track financial progress",
      "Understand and manage consumer debt",
      "Begin investing with confidence",
    ],
    completionTime: "8–10 hours",
    price: 19.99,
    currency: "USD",
    availability: ["featured"],
    inStock: true,
    imageUrl: "/images/marketplace/financial-competency.jpg",
    imageAlt: "Financial Competency book cover",
    languages: ["en", "es"],
    isDigital: false,
    isPhysical: true,
    availableRegions: ["ALL"],
    tags: ["foundations", "budgeting", "personal-finance", "competency"],
    rating: 4.8,
    reviewCount: 176,
  },
  {
    id: "financial-templates-bundle",
    slug: "financial-templates-bundle",
    name: "Financial Templates Bundle",
    shortDescription:
      "Ready-to-use spreadsheets and worksheets for budgeting, cash flow, net worth, and more.",
    description:
      "A collection of professionally designed financial templates you can use immediately. Includes a personal budget tracker, cash flow statement, net worth calculator, debt payoff planner, investment tracking spreadsheet, and business P&L template.",
    category: "GENERAL",
    productType: "digital",
    format: "financial-template",
    level: "beginner",
    difficulty: "beginner",
    learningObjectives: [
      "Track personal and household cash flow",
      "Calculate and monitor net worth",
      "Plan debt payoff with precision",
      "Monitor investment performance",
    ],
    price: 14.99,
    currency: "USD",
    availability: ["new", "featured"],
    inStock: true,
    imageUrl: "/images/marketplace/financial-templates.jpg",
    imageAlt: "Financial Templates Bundle",
    languages: ["en", "es"],
    isDigital: true,
    isPhysical: false,
    availableRegions: ["ALL"],
    tags: ["templates", "budgeting", "spreadsheets", "tools"],
    rating: 4.7,
    reviewCount: 63,
  },
  {
    id: "real-estate-checklist",
    slug: "real-estate-checklist",
    name: "Real Estate Investment Checklist",
    shortDescription:
      "A comprehensive due diligence checklist for evaluating real estate investment opportunities.",
    description:
      "Stop guessing when evaluating investment properties. This detailed checklist guides you through property analysis, market research, financial projections, legal considerations, and risk assessment — so you never miss a critical step.",
    category: "RED",
    productType: "digital",
    format: "checklist",
    level: "beginner",
    difficulty: "beginner",
    price: 9.99,
    currency: "USD",
    availability: ["new"],
    inStock: true,
    imageUrl: "/images/marketplace/real-estate-checklist.jpg",
    imageAlt: "Real Estate Investment Checklist",
    languages: ["en", "es"],
    isDigital: true,
    isPhysical: false,
    availableRegions: ["ALL"],
    tags: ["real-estate", "checklist", "due-diligence"],
    rating: 4.6,
    reviewCount: 41,
  },

  // ════════════════════════════════════════════
  //  SHOP — Merchandise
  // ════════════════════════════════════════════
  {
    id: "rwb-t-shirt",
    slug: "rwb-t-shirt",
    name: "RED.WHITE.BLUE. Classic T-Shirt",
    shortDescription:
      "Wear the system. Premium unisex t-shirt featuring the Edunancial RED.WHITE.BLUE. wordmark.",
    description:
      "High-quality 100% cotton unisex t-shirt featuring the iconic Edunancial RED.WHITE.BLUE. logo. Available in multiple colors and sizes. Worldwide fulfillment — delivered to your door anywhere on the planet.",
    category: "GENERAL",
    productType: "merchandise",
    format: "t-shirt",
    price: 34.99,
    currency: "USD",
    availability: ["featured"],
    inStock: true,
    imageUrl: "/images/marketplace/rwb-tshirt.jpg",
    imageAlt: "RED.WHITE.BLUE. Classic T-Shirt",
    languages: ["en"],
    isDigital: false,
    isPhysical: true,
    availableRegions: ["ALL"],
    tags: ["apparel", "t-shirt", "branded"],
    rating: 4.8,
    reviewCount: 57,
    specifications: {
      Material: "100% Cotton",
      Fit: "Unisex Regular",
      Sizes: "XS – 3XL",
      Colors: "Black, White, Navy, Red",
      Fulfillment: "Worldwide",
    },
  },
  {
    id: "edunancial-polo",
    slug: "edunancial-polo",
    name: "Edunancial Polo Shirt",
    shortDescription:
      "Professional polo shirt with embroidered Edunancial branding.",
    description:
      "A premium polo shirt with embroidered Edunancial logo — perfect for networking, events, and everyday professional wear. Made from moisture-wicking performance fabric. Available worldwide.",
    category: "GENERAL",
    productType: "merchandise",
    format: "polo",
    price: 49.99,
    currency: "USD",
    availability: ["new", "featured"],
    inStock: true,
    imageUrl: "/images/marketplace/edunancial-polo.jpg",
    imageAlt: "Edunancial Polo Shirt",
    languages: ["en"],
    isDigital: false,
    isPhysical: true,
    availableRegions: ["ALL"],
    tags: ["apparel", "polo", "branded", "professional"],
    rating: 4.9,
    reviewCount: 23,
    specifications: {
      Material: "Performance Piqué",
      Fit: "Unisex",
      Sizes: "XS – 3XL",
      Colors: "Black, White, Navy",
      Fulfillment: "Worldwide",
    },
  },
  {
    id: "rwb-hoodie",
    slug: "rwb-hoodie",
    name: "RED.WHITE.BLUE. Premium Hoodie",
    shortDescription:
      "Heavyweight fleece hoodie with Edunancial graphic print.",
    description:
      "A warm, heavyweight fleece hoodie featuring a bold Edunancial graphic. Built for comfort and community. Worldwide fulfillment.",
    category: "GENERAL",
    productType: "merchandise",
    format: "hoodie",
    price: 64.99,
    currency: "USD",
    availability: ["featured", "best-seller"],
    inStock: true,
    imageUrl: "/images/marketplace/rwb-hoodie.jpg",
    imageAlt: "RED.WHITE.BLUE. Premium Hoodie",
    languages: ["en"],
    isDigital: false,
    isPhysical: true,
    availableRegions: ["ALL"],
    tags: ["apparel", "hoodie", "branded"],
    rating: 4.9,
    reviewCount: 89,
    specifications: {
      Material: "80% Cotton / 20% Polyester",
      Fit: "Unisex Regular",
      Sizes: "XS – 3XL",
      Colors: "Black, Charcoal, Navy",
      Fulfillment: "Worldwide",
    },
  },
  {
    id: "edunancial-baseball-cap",
    slug: "edunancial-baseball-cap",
    name: "Edunancial Baseball Cap",
    shortDescription:
      "Structured baseball cap with embroidered Edunancial logo.",
    description:
      "A classic six-panel structured baseball cap with embroidered Edunancial logo on the front. Adjustable strap. One size fits most. Ships worldwide.",
    category: "GENERAL",
    productType: "merchandise",
    format: "baseball-cap",
    price: 29.99,
    currency: "USD",
    availability: ["new"],
    inStock: true,
    imageUrl: "/images/marketplace/edunancial-cap.jpg",
    imageAlt: "Edunancial Baseball Cap",
    languages: ["en"],
    isDigital: false,
    isPhysical: true,
    availableRegions: ["ALL"],
    tags: ["headwear", "cap", "branded"],
    rating: 4.7,
    reviewCount: 34,
    specifications: {
      Material: "Structured Cotton Twill",
      Closure: "Adjustable Snapback",
      Colors: "Black, Navy, White",
      Fulfillment: "Worldwide",
    },
  },
  {
    id: "edunancial-coffee-mug",
    slug: "edunancial-coffee-mug",
    name: "Edunancial Coffee Mug",
    shortDescription:
      "Start every morning with a reminder of your financial goals.",
    description:
      "A high-quality 15oz ceramic coffee mug with the Edunancial RED.WHITE.BLUE. wordmark. Dishwasher safe. Ships worldwide — perfect for your morning routine or as a gift.",
    category: "GENERAL",
    productType: "merchandise",
    format: "coffee-mug",
    price: 19.99,
    currency: "USD",
    availability: ["featured"],
    inStock: true,
    imageUrl: "/images/marketplace/edunancial-mug.jpg",
    imageAlt: "Edunancial Coffee Mug",
    languages: ["en"],
    isDigital: false,
    isPhysical: true,
    availableRegions: ["ALL"],
    tags: ["drinkware", "mug", "branded"],
    rating: 4.8,
    reviewCount: 112,
    specifications: {
      Capacity: "15oz",
      Material: "Ceramic",
      "Dishwasher Safe": "Yes",
      Colors: "Black, White",
      Fulfillment: "Worldwide",
    },
  },
  {
    id: "edunancial-journal",
    slug: "edunancial-journal",
    name: "Edunancial Financial Journal",
    shortDescription:
      "A premium lined journal designed for tracking your financial journey.",
    description:
      "A premium hardcover lined journal featuring the Edunancial brand. Use it to record goals, track habits, plan investments, and reflect on your financial progress. 160 pages of thick, ink-resistant paper.",
    category: "GENERAL",
    productType: "merchandise",
    format: "journal",
    price: 24.99,
    currency: "USD",
    availability: ["new", "featured"],
    inStock: true,
    imageUrl: "/images/marketplace/edunancial-journal.jpg",
    imageAlt: "Edunancial Financial Journal",
    languages: ["en"],
    isDigital: false,
    isPhysical: true,
    availableRegions: ["ALL"],
    tags: ["stationery", "journal", "branded"],
    rating: 4.9,
    reviewCount: 48,
    specifications: {
      Pages: "160",
      "Cover Type": "Hardcover",
      "Paper Weight": "100gsm",
      Ruling: "Lined",
      Colors: "Black, Navy",
      Fulfillment: "Worldwide",
    },
  },
  {
    id: "edunancial-tote-bag",
    slug: "edunancial-tote-bag",
    name: "Edunancial Canvas Tote Bag",
    shortDescription:
      "Heavy-duty canvas tote with bold Edunancial print. Carry your knowledge everywhere.",
    description:
      "A sturdy, reusable canvas tote bag featuring a bold Edunancial print. Strong handles, roomy interior. Perfect for books, a laptop, or everyday use. Ships worldwide.",
    category: "GENERAL",
    productType: "merchandise",
    format: "tote-bag",
    price: 22.99,
    currency: "USD",
    availability: ["new"],
    inStock: true,
    imageUrl: "/images/marketplace/edunancial-tote.jpg",
    imageAlt: "Edunancial Canvas Tote Bag",
    languages: ["en"],
    isDigital: false,
    isPhysical: true,
    availableRegions: ["ALL"],
    tags: ["accessories", "tote", "bag", "branded"],
    rating: 4.6,
    reviewCount: 19,
    specifications: {
      Material: "12oz Cotton Canvas",
      Dimensions: '15" x 15" x 4"',
      Handles: '22" Drop Length',
      Colors: "Natural, Black",
      Fulfillment: "Worldwide",
    },
  },
  {
    id: "edunancial-gift-card",
    slug: "edunancial-gift-card",
    name: "Edunancial Gift Card",
    shortDescription:
      "Give the gift of financial education. Valid for any Marketplace purchase.",
    description:
      "An Edunancial digital gift card redeemable for any product in the Marketplace — books, eBooks, courses, merchandise, and more. Delivered by email. Available in multiple denominations.",
    category: "GENERAL",
    productType: "digital",
    format: "gift-card",
    price: 25.0,
    originalPrice: undefined,
    currency: "USD",
    availability: ["featured"],
    inStock: true,
    imageUrl: "/images/marketplace/gift-card.jpg",
    imageAlt: "Edunancial Gift Card",
    languages: ["en", "es", "fr"],
    isDigital: true,
    isPhysical: false,
    availableRegions: ["ALL"],
    tags: ["gift", "gift-card"],
    rating: 5.0,
    reviewCount: 7,
    faqs: [
      {
        question: "How is the gift card delivered?",
        answer:
          "By email within minutes of purchase. The recipient receives a unique code redeemable at checkout.",
      },
      {
        question: "Does the gift card expire?",
        answer: "No. Edunancial Gift Cards do not expire.",
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getLearnProducts(): MarketplaceProduct[] {
  return MARKETPLACE_PRODUCTS.filter((p) => p.productType !== "merchandise");
}

export function getShopProducts(): MarketplaceProduct[] {
  return MARKETPLACE_PRODUCTS.filter((p) => p.productType === "merchandise");
}

export function getFeaturedProducts(limit = 6): MarketplaceProduct[] {
  return MARKETPLACE_PRODUCTS.filter((p) =>
    p.availability.includes("featured")
  ).slice(0, limit);
}

export function getProductBySlug(
  slug: string
): MarketplaceProduct | undefined {
  return MARKETPLACE_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(
  category: MarketplaceProduct["category"]
): MarketplaceProduct[] {
  return MARKETPLACE_PRODUCTS.filter((p) => p.category === category);
}
