import type { Product, Instructor, ProductReview, Coupon } from "@/types/product";

export const instructors: Instructor[] = [
  {
    id: "instructor-1",
    name: "Edunancial Education Team",
    title: "Financial Competency Educators",
    bio: "The Edunancial Education Team brings together experienced financial educators, real estate professionals, and business leaders to deliver practical, competency-based education.",
    credentials: ["Certified Financial Educator", "Real Estate Investor", "Business Coach"],
    productCount: 12,
    averageRating: 4.9,
    totalStudents: 5200,
  },
  {
    id: "instructor-2",
    name: "Marcus J. Williams",
    title: "Real Estate Investment Strategist",
    bio: "Marcus has 20+ years of real estate investing experience across residential, commercial, tax liens, and creative financing strategies.",
    credentials: ["Licensed Real Estate Broker", "Tax Lien Specialist", "1031 Exchange Expert"],
    productCount: 6,
    averageRating: 4.8,
    totalStudents: 2800,
  },
  {
    id: "instructor-3",
    name: "Dr. Denise Carter",
    title: "Business Profitability Coach",
    bio: "Dr. Carter has helped over 1,000 entrepreneurs build profitable businesses using the RED, WHITE & BLUE framework for financial competency.",
    credentials: ["Ph.D. Business Administration", "Certified Business Coach", "Fortune 500 Consultant"],
    productCount: 4,
    averageRating: 4.9,
    totalStudents: 1900,
  },
];

export const products: Product[] = [
  // COURSES
  {
    id: "course-rwb-foundations",
    slug: "red-white-blue-financial-foundations",
    title: "RED, WHITE & BLUE Financial Foundations",
    subtitle: "The Complete Financial Competency System",
    description:
      "Master the three pillars of financial competency: Real Estate (RED), Financial Assets (WHITE), and Business (BLUE). This comprehensive course delivers the foundation for building lasting wealth through practical, actionable education.",
    category: "course",
    tags: ["foundations", "real estate", "investing", "business", "beginner"],
    instructor: instructors[0],
    price: 197,
    compareAtPrice: 297,
    currency: "USD",
    featured: true,
    recommended: true,
    digital: true,
    status: "active",
    reviewCount: 312,
    averageRating: 4.9,
    totalSales: 1840,
    membershipDiscount: { tier: "basic", discountPercent: 20 },
    seoTitle: "RED WHITE BLUE Financial Foundations Course | Edunancial",
    seoDescription:
      "Build real financial competency across real estate, paper assets, and business with the Edunancial flagship course.",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "course-real-estate-red",
    slug: "real-estate-competency-red-track",
    title: "Real Estate Competency — RED Track",
    subtitle: "Residential, Commercial, Tax Liens & Creative Financing",
    description:
      "Build deep real estate competency covering residential and commercial investing, tax liens, tax deeds, 1031 exchanges, and creative financing strategies used by professional investors.",
    category: "course",
    tags: ["real estate", "tax liens", "creative financing", "commercial", "intermediate"],
    instructor: instructors[1],
    price: 147,
    compareAtPrice: 197,
    currency: "USD",
    featured: true,
    recommended: false,
    digital: true,
    status: "active",
    reviewCount: 198,
    averageRating: 4.8,
    totalSales: 1120,
    membershipDiscount: { tier: "basic", discountPercent: 15 },
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2025-05-01T00:00:00Z",
  },
  {
    id: "course-business-blue",
    slug: "business-competency-blue-track",
    title: "Business Competency — BLUE Track",
    subtitle: "Entrepreneurship, KPIs, Profit & Scaling",
    description:
      "Learn to build and scale a profitable business. Covers entrepreneurship fundamentals, KPI tracking, marketing, profit optimization, and leadership development.",
    category: "course",
    tags: ["business", "entrepreneur", "KPIs", "profit", "scaling", "marketing"],
    instructor: instructors[2],
    price: 147,
    compareAtPrice: 197,
    currency: "USD",
    featured: false,
    recommended: true,
    digital: true,
    status: "active",
    reviewCount: 154,
    averageRating: 4.9,
    totalSales: 930,
    membershipDiscount: { tier: "basic", discountPercent: 15 },
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2025-05-01T00:00:00Z",
  },
  {
    id: "course-financial-assets-white",
    slug: "financial-asset-competency-white-track",
    title: "Financial Asset Competency — WHITE Track",
    subtitle: "Budgeting, Credit, Stocks, ETFs & Retirement",
    description:
      "Build competency in personal finance and paper assets: budgeting, credit optimization, stocks, ETFs, options, precious metals, and retirement planning.",
    category: "course",
    tags: ["investing", "stocks", "ETFs", "retirement", "credit", "budgeting"],
    instructor: instructors[0],
    price: 147,
    compareAtPrice: 197,
    currency: "USD",
    featured: false,
    recommended: false,
    digital: true,
    status: "active",
    reviewCount: 211,
    averageRating: 4.7,
    totalSales: 1050,
    membershipDiscount: { tier: "basic", discountPercent: 15 },
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2025-05-01T00:00:00Z",
  },

  // BOOKS
  {
    id: "book-wealth-building",
    slug: "wealth-building-the-red-white-blue-way",
    title: "Wealth Building the RED, WHITE & BLUE Way",
    subtitle: "A Practical Guide to Financial Competency",
    description:
      "The definitive Edunancial book covering all three pillars. Available in English and Spanish. Digital download includes PDF and epub versions.",
    category: "book",
    tags: ["foundations", "wealth", "real estate", "business", "investing"],
    instructor: instructors[0],
    price: 29,
    compareAtPrice: 39,
    currency: "USD",
    variants: [
      { id: "book-wealth-digital", label: "Digital (PDF + ePub)", price: 29 },
      { id: "book-wealth-print", label: "Print Edition", price: 49, stock: 200 },
      { id: "book-wealth-bundle", label: "Digital + Print Bundle", price: 59, stock: 150 },
    ],
    featured: true,
    recommended: true,
    digital: false, // has physical variant
    status: "active",
    reviewCount: 289,
    averageRating: 4.9,
    totalSales: 3200,
    membershipDiscount: { tier: "basic", discountPercent: 25 },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-04-01T00:00:00Z",
  },
  {
    id: "book-economic-self-defense",
    slug: "economic-self-defense",
    title: "Economic Self Defense",
    subtitle: "Protecting Your Financial Future",
    description:
      "Understand the financial forces working against everyday Americans and build the competency to protect and grow your wealth in any economic environment.",
    category: "book",
    tags: ["personal finance", "wealth protection", "economics", "intermediate"],
    instructor: instructors[0],
    price: 24,
    compareAtPrice: 34,
    currency: "USD",
    variants: [
      { id: "book-esd-digital", label: "Digital (PDF + ePub)", price: 24 },
      { id: "book-esd-print", label: "Print Edition", price: 39, stock: 150 },
    ],
    featured: false,
    recommended: true,
    digital: false,
    status: "active",
    reviewCount: 178,
    averageRating: 4.8,
    totalSales: 1890,
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "book-business-profit",
    slug: "business-is-about-making-profit",
    title: "Business Is About Making Profit",
    subtitle: "The Edunancial Business Framework",
    description:
      "Strip away the complexity and build a profitable business using the Edunancial framework. Real-world strategies for entrepreneurs at every stage.",
    category: "book",
    tags: ["business", "profit", "entrepreneur", "framework"],
    instructor: instructors[2],
    price: 24,
    compareAtPrice: 34,
    currency: "USD",
    variants: [
      { id: "book-bap-digital", label: "Digital (PDF + ePub)", price: 24 },
      { id: "book-bap-print", label: "Print Edition", price: 39, stock: 120 },
    ],
    featured: false,
    recommended: false,
    digital: false,
    status: "active",
    reviewCount: 143,
    averageRating: 4.9,
    totalSales: 1420,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },

  // AUDIOBOOKS
  {
    id: "audiobook-wealth-building",
    slug: "wealth-building-audiobook",
    title: "Wealth Building the RED, WHITE & BLUE Way — Audiobook",
    subtitle: "Full Narrated Audio Version",
    description:
      "The complete Wealth Building audiobook, narrated in a clear, engaging style. Listen on any device, at your own pace. Includes English and Spanish versions.",
    category: "audiobook",
    tags: ["foundations", "wealth", "audiobook", "bilingual"],
    instructor: instructors[0],
    price: 34,
    compareAtPrice: 44,
    currency: "USD",
    featured: false,
    recommended: true,
    digital: true,
    status: "active",
    reviewCount: 97,
    averageRating: 4.8,
    totalSales: 780,
    membershipDiscount: { tier: "basic", discountPercent: 20 },
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2025-04-01T00:00:00Z",
  },

  // DOWNLOADS
  {
    id: "download-flashcard-pack",
    slug: "financial-terms-flashcard-pack",
    title: "Financial Terms Flashcard Pack",
    subtitle: "500+ Essential Financial Terms",
    description:
      "Comprehensive flashcard set covering 500+ essential financial, real estate, and business terms. Available as printable PDF and interactive digital set.",
    category: "download",
    tags: ["flashcards", "study", "terms", "beginner"],
    instructor: instructors[0],
    price: 19,
    compareAtPrice: 29,
    currency: "USD",
    featured: false,
    recommended: true,
    digital: true,
    status: "active",
    reviewCount: 234,
    averageRating: 4.7,
    totalSales: 4100,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "download-business-plan-template",
    slug: "business-plan-template-pack",
    title: "Business Plan Template Pack",
    subtitle: "Professional Templates for Entrepreneurs",
    description:
      "Complete business plan template pack including executive summary, financial projections, market analysis, and investor pitch deck templates.",
    category: "download",
    tags: ["business", "templates", "entrepreneur", "planning"],
    instructor: instructors[2],
    price: 39,
    compareAtPrice: 59,
    currency: "USD",
    featured: false,
    recommended: false,
    digital: true,
    status: "active",
    reviewCount: 189,
    averageRating: 4.8,
    totalSales: 2300,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "download-real-estate-worksheet-pack",
    slug: "real-estate-analysis-worksheets",
    title: "Real Estate Analysis Worksheet Pack",
    subtitle: "Deal Analysis Tools for Investors",
    description:
      "Professional worksheets for analyzing residential, commercial, tax lien, and rental property deals. Includes ROI calculators and due diligence checklists.",
    category: "download",
    tags: ["real estate", "worksheets", "analysis", "investing", "tools"],
    instructor: instructors[1],
    price: 29,
    compareAtPrice: 49,
    currency: "USD",
    featured: false,
    recommended: true,
    digital: true,
    status: "active",
    reviewCount: 167,
    averageRating: 4.9,
    totalSales: 1890,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2025-04-01T00:00:00Z",
  },

  // COACHING
  {
    id: "coaching-1on1-session",
    slug: "one-on-one-financial-coaching-session",
    title: "1-on-1 Financial Competency Coaching",
    subtitle: "60-Minute Private Coaching Session",
    description:
      "A private, focused coaching session to work through your specific financial situation, build a personalized action plan, and accelerate your path to financial competency.",
    category: "coaching",
    tags: ["coaching", "1-on-1", "personalized", "action plan"],
    vendorName: "Edunancial Coaching",
    price: 197,
    currency: "USD",
    variants: [
      { id: "coaching-single", label: "Single Session (60 min)", price: 197 },
      { id: "coaching-3pack", label: "3-Session Pack", price: 497 },
      { id: "coaching-6pack", label: "6-Session Pack", price: 897 },
    ],
    featured: true,
    recommended: false,
    digital: true,
    status: "active",
    reviewCount: 89,
    averageRating: 5.0,
    totalSales: 340,
    createdAt: "2024-05-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },

  // CERTIFICATIONS
  {
    id: "cert-financial-competency",
    slug: "edunancial-financial-competency-certification",
    title: "Edunancial Financial Competency Certification",
    subtitle: "Verified Competency Badge & Certificate",
    description:
      "Earn the official Edunancial Financial Competency Certification by completing the full assessment track, demonstrating practical knowledge across all three pillars.",
    category: "certification",
    tags: ["certification", "credential", "badge", "assessment"],
    instructor: instructors[0],
    price: 97,
    compareAtPrice: 147,
    currency: "USD",
    featured: false,
    recommended: false,
    digital: true,
    status: "active",
    reviewCount: 412,
    averageRating: 4.9,
    totalSales: 2100,
    membershipDiscount: { tier: "premium", discountPercent: 100 }, // free for premium
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },

  // MERCHANDISE
  {
    id: "merch-rwb-hat",
    slug: "red-white-blue-snapback-hat",
    title: "RED.WHITE.BLUE. Snapback Hat",
    subtitle: "Premium Structured Cap",
    description:
      "Premium structured snapback hat featuring the iconic RED.WHITE.BLUE. branding. Available in classic black and navy colorways.",
    category: "merchandise",
    tags: ["hat", "apparel", "snapback", "merchandise"],
    vendorName: "Edunancial Store",
    price: 35,
    currency: "USD",
    variants: [
      { id: "hat-black", label: "Black", price: 35, stock: 85, sku: "HAT-BLK-OS" },
      { id: "hat-navy", label: "Navy", price: 35, stock: 60, sku: "HAT-NVY-OS" },
    ],
    featured: false,
    recommended: false,
    digital: false,
    stock: 145,
    status: "active",
    reviewCount: 44,
    averageRating: 4.8,
    totalSales: 380,
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2025-05-01T00:00:00Z",
  },
  {
    id: "merch-rwb-hoodie",
    slug: "red-white-blue-pullover-hoodie",
    title: "RED.WHITE.BLUE. Pullover Hoodie",
    subtitle: "Premium Heavyweight Fleece",
    description:
      "Premium heavyweight pullover hoodie. Embroidered RED.WHITE.BLUE. logo on front, Edunancial on back. Unisex sizing.",
    category: "merchandise",
    tags: ["hoodie", "apparel", "fleece", "merchandise"],
    vendorName: "Edunancial Store",
    price: 65,
    currency: "USD",
    variants: [
      { id: "hoodie-s", label: "Small", price: 65, stock: 40, sku: "HOOD-S" },
      { id: "hoodie-m", label: "Medium", price: 65, stock: 55, sku: "HOOD-M" },
      { id: "hoodie-l", label: "Large", price: 65, stock: 50, sku: "HOOD-L" },
      { id: "hoodie-xl", label: "XL", price: 65, stock: 35, sku: "HOOD-XL" },
      { id: "hoodie-2xl", label: "2XL", price: 65, stock: 25, sku: "HOOD-2XL" },
    ],
    featured: false,
    recommended: false,
    digital: false,
    stock: 205,
    status: "active",
    reviewCount: 31,
    averageRating: 4.7,
    totalSales: 190,
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2025-05-01T00:00:00Z",
  },

  // BUNDLE
  {
    id: "bundle-complete-foundations",
    slug: "complete-financial-foundations-bundle",
    title: "Complete Financial Foundations Bundle",
    subtitle: "Course + Book + Flashcards — Maximum Savings",
    description:
      "Get the RED, WHITE & BLUE Foundations Course, the flagship Wealth Building book (digital), and the Financial Terms Flashcard Pack together at a significant discount.",
    category: "bundle",
    tags: ["bundle", "foundations", "savings", "complete"],
    instructor: instructors[0],
    price: 197,
    compareAtPrice: 245,
    currency: "USD",
    featured: true,
    recommended: true,
    digital: true,
    status: "active",
    reviewCount: 176,
    averageRating: 4.9,
    totalSales: 890,
    membershipDiscount: { tier: "basic", discountPercent: 20 },
    seoTitle: "Complete Financial Foundations Bundle | Edunancial",
    seoDescription:
      "Get the complete Edunancial foundations bundle — course, book, and flashcards at maximum savings.",
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },

  // MEMBERSHIP (upsell product)
  {
    id: "membership-premium",
    slug: "edunancial-premium-membership",
    title: "Edunancial Premium Membership",
    subtitle: "Full Access — All Courses, AI Coach, Priority Support",
    description:
      "Unlock the full Edunancial platform with Premium membership. Access all courses, the AI Coach, downloadable content, priority support, and unlimited certifications.",
    category: "membership",
    tags: ["membership", "premium", "all-access", "subscription"],
    vendorName: "Edunancial",
    price: 49,
    compareAtPrice: 79,
    currency: "USD",
    variants: [
      { id: "membership-monthly", label: "Monthly ($49/mo)", price: 49 },
      { id: "membership-annual", label: "Annual ($499/yr — save 15%)", price: 499 },
    ],
    featured: true,
    recommended: true,
    digital: true,
    status: "active",
    reviewCount: 503,
    averageRating: 4.9,
    totalSales: 3800,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
];

export const reviews: ProductReview[] = [
  {
    id: "review-1",
    productId: "course-rwb-foundations",
    authorName: "James T.",
    rating: 5,
    title: "Changed how I think about money",
    body: "I've taken dozens of finance courses and none of them approached it the way Edunancial does. The RED, WHITE & BLUE framework gives you a complete system, not just pieces.",
    verified: true,
    createdAt: "2025-03-10T00:00:00Z",
  },
  {
    id: "review-2",
    productId: "course-rwb-foundations",
    authorName: "Maria C.",
    rating: 5,
    title: "Finally, practical education",
    body: "I appreciated that every lesson includes an actionable step. No fluff — just real education that helps you build actual competency.",
    verified: true,
    createdAt: "2025-02-20T00:00:00Z",
  },
  {
    id: "review-3",
    productId: "book-wealth-building",
    authorName: "David W.",
    rating: 5,
    title: "Best financial book I've read in years",
    body: "Clear, comprehensive, and actionable. This is the book I wish I had 10 years ago.",
    verified: true,
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "review-4",
    productId: "download-flashcard-pack",
    authorName: "Keisha M.",
    rating: 4,
    title: "Great study tool",
    body: "Very comprehensive set. I use these to prep for the competency assessment and they've been invaluable.",
    verified: true,
    createdAt: "2025-04-05T00:00:00Z",
  },
  {
    id: "review-5",
    productId: "coaching-1on1-session",
    authorName: "Robert K.",
    rating: 5,
    title: "Worth every penny",
    body: "My coaching session was incredibly focused and productive. Came out with a clear action plan and felt confident about my next steps.",
    verified: true,
    createdAt: "2025-05-12T00:00:00Z",
  },
];

export const coupons: Coupon[] = [
  {
    code: "LAUNCH20",
    discountType: "percent",
    discountValue: 20,
    minimumOrder: 50,
    active: true,
    usageLimit: 500,
    usageCount: 123,
  },
  {
    code: "WELCOME10",
    discountType: "percent",
    discountValue: 10,
    active: true,
    usageLimit: undefined,
    usageCount: 890,
  },
  {
    code: "MEMBER30",
    discountType: "percent",
    discountValue: 30,
    active: true,
    usageLimit: 100,
    usageCount: 45,
    applicableCategories: ["course", "book", "audiobook"],
  },
  {
    code: "SAVE50",
    discountType: "fixed",
    discountValue: 50,
    minimumOrder: 150,
    active: true,
    usageLimit: 50,
    usageCount: 12,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category && p.status === "active");
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured && p.status === "active");
}

export function getRecommendedProducts(): Product[] {
  return products.filter((p) => p.recommended && p.status === "active");
}

export function getProductReviews(productId: string): ProductReview[] {
  return reviews.filter((r) => r.productId === productId);
}

export function getInstructorById(id: string): Instructor | undefined {
  return instructors.find((i) => i.id === id);
}

export function getInstructorProducts(instructorId: string): Product[] {
  return products.filter(
    (p) => p.instructor?.id === instructorId && p.status === "active"
  );
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.status === "active" &&
      (p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        (p.subtitle?.toLowerCase().includes(q) ?? false))
  );
}

export function validateCoupon(code: string, subtotal: number): Coupon | null {
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase() && c.active
  );
  if (!coupon) return null;
  if (coupon.minimumOrder && subtotal < coupon.minimumOrder) return null;
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return null;
  return coupon;
}

export function applyCouponDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.discountType === "percent") {
    return Math.round(subtotal * (coupon.discountValue / 100) * 100) / 100;
  }
  return Math.min(coupon.discountValue, subtotal);
}

export const CATEGORY_LABELS: Record<string, string> = {
  course: "Courses",
  book: "Books",
  audiobook: "Audiobooks",
  download: "Downloads",
  membership: "Memberships",
  coaching: "Coaching",
  consulting: "Consulting",
  certification: "Certifications",
  merchandise: "Merchandise",
  bundle: "Bundles",
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  course: "Structured, competency-based courses across real estate, finance, and business.",
  book: "Books in print and digital format, available in English and Spanish.",
  audiobook: "Narrated audio versions of the Edunancial book library.",
  download: "Worksheets, templates, flashcards, and other downloadable tools.",
  membership: "All-access memberships with courses, coaching, and priority support.",
  coaching: "Private 1-on-1 coaching sessions with Edunancial educators.",
  consulting: "Consulting engagements for businesses and entrepreneurs.",
  certification: "Earn verified credentials to demonstrate your financial competency.",
  merchandise: "Apparel and accessories representing the RED.WHITE.BLUE. mission.",
  bundle: "Bundled products at a significant discount.",
};
