import type {
  ForumCategoryMeta,
  CommunityMember,
  Discussion,
  ModerationReport,
  AuditLog,
  CommunityStats,
} from "@/types/community";

export const FORUM_CATEGORIES: ForumCategoryMeta[] = [
  {
    slug: "budgeting",
    label: "Budgeting",
    description:
      "Strategies for managing income, expenses, and building emergency funds.",
    icon: "💰",
    threadCount: 312,
    postCount: 1840,
    color: "bg-green-700",
  },
  {
    slug: "credit",
    label: "Credit",
    description:
      "Credit scores, debt management, credit cards, and rebuilding credit.",
    icon: "💳",
    threadCount: 278,
    postCount: 1550,
    color: "bg-blue-700",
  },
  {
    slug: "investing",
    label: "Investing",
    description:
      "Stocks, ETFs, index funds, portfolio strategy, and market analysis.",
    icon: "📈",
    threadCount: 445,
    postCount: 2980,
    color: "bg-purple-700",
  },
  {
    slug: "retirement",
    label: "Retirement",
    description:
      "401(k), IRA, pension, Social Security, and retirement planning.",
    icon: "🏖️",
    threadCount: 198,
    postCount: 1120,
    color: "bg-yellow-700",
  },
  {
    slug: "taxes",
    label: "Taxes",
    description:
      "Tax planning, deductions, filing strategies, and IRS guidance.",
    icon: "📋",
    threadCount: 167,
    postCount: 890,
    color: "bg-red-700",
  },
  {
    slug: "insurance",
    label: "Insurance",
    description:
      "Life, health, auto, home, and business insurance coverage.",
    icon: "🛡️",
    threadCount: 143,
    postCount: 760,
    color: "bg-teal-700",
  },
  {
    slug: "entrepreneurship",
    label: "Entrepreneurship",
    description:
      "Starting a business, funding, scaling, and founder finance.",
    icon: "🚀",
    threadCount: 389,
    postCount: 2210,
    color: "bg-orange-700",
  },
  {
    slug: "real-estate",
    label: "Real Estate",
    description:
      "Property investing, mortgages, flipping, and rental income.",
    icon: "🏘️",
    threadCount: 334,
    postCount: 1970,
    color: "bg-indigo-700",
  },
  {
    slug: "fraud-prevention",
    label: "Financial Fraud Prevention",
    description:
      "Scam awareness, identity theft, phishing, and consumer protection.",
    icon: "🔒",
    threadCount: 112,
    postCount: 640,
    color: "bg-rose-700",
  },
  {
    slug: "general",
    label: "General Financial Literacy",
    description:
      "Open discussion on money, wealth mindset, and financial fundamentals.",
    icon: "📚",
    threadCount: 521,
    postCount: 3340,
    color: "bg-slate-600",
  },
];

export const COMMUNITY_MEMBERS: CommunityMember[] = [
  {
    id: "m1",
    username: "maria_builds",
    displayName: "Maria T.",
    avatarInitials: "MT",
    avatarColor: "bg-blue-600",
    joinedDate: "2022-03-14",
    reputationPoints: 4820,
    badge: "champion",
    standing: "good",
    helpfulAnswers: 214,
    threadCount: 87,
    postCount: 1230,
    bio: "Real estate investor and financial literacy advocate.",
    expertise: ["real-estate", "investing"],
  },
  {
    id: "m2",
    username: "david_finance",
    displayName: "David K.",
    avatarInitials: "DK",
    avatarColor: "bg-green-600",
    joinedDate: "2022-07-01",
    reputationPoints: 3760,
    badge: "expert",
    standing: "good",
    helpfulAnswers: 178,
    threadCount: 64,
    postCount: 990,
    bio: "Certified Financial Planner helping families build wealth.",
    expertise: ["budgeting", "retirement"],
  },
  {
    id: "m3",
    username: "sophia_invest",
    displayName: "Sophia R.",
    avatarInitials: "SR",
    avatarColor: "bg-purple-600",
    joinedDate: "2023-01-18",
    reputationPoints: 2900,
    badge: "trusted",
    standing: "good",
    helpfulAnswers: 132,
    threadCount: 51,
    postCount: 720,
    bio: "Index fund enthusiast and FIRE community member.",
    expertise: ["investing", "retirement"],
  },
  {
    id: "m4",
    username: "james_cfo",
    displayName: "James O.",
    avatarInitials: "JO",
    avatarColor: "bg-yellow-600",
    joinedDate: "2023-04-05",
    reputationPoints: 2450,
    badge: "trusted",
    standing: "good",
    helpfulAnswers: 98,
    threadCount: 43,
    postCount: 610,
    bio: "Small business CFO and entrepreneurship mentor.",
    expertise: ["entrepreneurship", "taxes"],
  },
  {
    id: "m5",
    username: "olivia_budget",
    displayName: "Olivia N.",
    avatarInitials: "ON",
    avatarColor: "bg-pink-600",
    joinedDate: "2023-09-12",
    reputationPoints: 1880,
    badge: "contributor",
    standing: "good",
    helpfulAnswers: 67,
    threadCount: 32,
    postCount: 440,
    bio: "Debt-free journey advocate helping others do the same.",
    expertise: ["budgeting", "credit"],
  },
  {
    id: "m6",
    username: "daniel_re",
    displayName: "Daniel M.",
    avatarInitials: "DM",
    avatarColor: "bg-teal-600",
    joinedDate: "2024-02-20",
    reputationPoints: 1210,
    badge: "contributor",
    standing: "good",
    helpfulAnswers: 45,
    threadCount: 21,
    postCount: 290,
    bio: "Real estate and rental property beginner sharing my journey.",
    expertise: ["real-estate"],
  },
];

export const DISCUSSIONS: Discussion[] = [
  {
    id: "d1",
    title: "How I paid off $42,000 in debt in 18 months using the avalanche method",
    slug: "paid-off-42k-debt-avalanche-method",
    category: "budgeting",
    tags: [
      { id: "t1", label: "debt-free" },
      { id: "t2", label: "avalanche-method" },
      { id: "t3", label: "budgeting" },
    ],
    authorId: "m5",
    author: COMMUNITY_MEMBERS[4],
    content:
      "Eighteen months ago I had $42,000 in consumer debt spread across 6 accounts. Today I am completely debt-free. I want to share the exact strategy I used — the debt avalanche method — and answer any questions you have. The key is attacking the highest-interest debt first while making minimum payments on everything else. Here is my month-by-month breakdown...",
    createdAt: "2025-11-03T10:22:00Z",
    updatedAt: "2025-11-10T08:14:00Z",
    views: 4820,
    likes: 312,
    replyCount: 47,
    isFeatured: true,
    isStaffPick: true,
    status: "approved",
    reportCount: 0,
    replies: [
      {
        id: "r1",
        authorId: "m2",
        author: COMMUNITY_MEMBERS[1],
        content:
          "This is phenomenal. The avalanche method is mathematically optimal and your discipline shows. One thing I would add is automating each payment so there is zero temptation to redirect funds.",
        createdAt: "2025-11-03T11:05:00Z",
        likes: 89,
        isHelpful: true,
        status: "approved",
        reportCount: 0,
      },
      {
        id: "r2",
        authorId: "m3",
        author: COMMUNITY_MEMBERS[2],
        content:
          "The snowball vs avalanche debate is real but for high-interest credit cards, avalanche wins every time mathematically. Did you track your net worth throughout the journey?",
        createdAt: "2025-11-04T09:30:00Z",
        likes: 54,
        status: "approved",
        reportCount: 0,
      },
    ],
  },
  {
    id: "d2",
    title: "Best low-cost index funds for a 30-year-old just starting to invest",
    slug: "best-index-funds-30-year-old",
    category: "investing",
    tags: [
      { id: "t4", label: "index-funds" },
      { id: "t5", label: "beginners" },
      { id: "t6", label: "etf" },
    ],
    authorId: "m6",
    author: COMMUNITY_MEMBERS[5],
    content:
      "I am 30, just started my investing journey, and want to build a simple low-cost portfolio. I have heard about the three-fund portfolio. Should I go with VTI + VXUS + BND or something different? My time horizon is at least 25–30 years. What do you recommend and why?",
    createdAt: "2025-12-15T14:00:00Z",
    updatedAt: "2025-12-20T10:00:00Z",
    views: 3340,
    likes: 198,
    replyCount: 32,
    isFeatured: true,
    status: "approved",
    reportCount: 0,
    replies: [
      {
        id: "r3",
        authorId: "m3",
        author: COMMUNITY_MEMBERS[2],
        content:
          "The three-fund portfolio is a proven, low-maintenance strategy. VTI covers the entire US market, VXUS adds international diversification, and BND provides bond stability. At 30 with a long horizon, a 90/10 or even 100% equity allocation is reasonable. Expense ratios matter — Vanguard, Fidelity, and Schwab all offer excellent options at under 0.05%.",
        createdAt: "2025-12-15T14:45:00Z",
        likes: 142,
        isHelpful: true,
        status: "approved",
        reportCount: 0,
      },
    ],
  },
  {
    id: "d3",
    title: "Understanding your credit score: the five factors explained simply",
    slug: "understanding-credit-score-five-factors",
    category: "credit",
    tags: [
      { id: "t7", label: "credit-score" },
      { id: "t8", label: "fico" },
      { id: "t9", label: "credit-education" },
    ],
    authorId: "m1",
    author: COMMUNITY_MEMBERS[0],
    content:
      "Your FICO score is calculated from five factors. Here is a clear breakdown with actionable tips for each: Payment History (35%), Amounts Owed (30%), Length of Credit History (15%), New Credit (10%), Credit Mix (10%). The single most important thing you can do is pay on time, every time.",
    createdAt: "2025-10-22T09:00:00Z",
    updatedAt: "2025-10-25T13:20:00Z",
    views: 6120,
    likes: 445,
    replyCount: 61,
    isFeatured: true,
    isStaffPick: true,
    isPinned: true,
    status: "approved",
    reportCount: 0,
    replies: [],
  },
  {
    id: "d4",
    title: "Common IRS red flags that trigger audits — what to avoid",
    slug: "irs-audit-red-flags",
    category: "taxes",
    tags: [
      { id: "t10", label: "irs" },
      { id: "t11", label: "audit" },
      { id: "t12", label: "tax-tips" },
    ],
    authorId: "m4",
    author: COMMUNITY_MEMBERS[3],
    content:
      "After 10 years as a small business CFO I have seen the patterns that attract IRS scrutiny. Here are the most common red flags: large charitable deductions relative to income, home office deductions that look too aggressive, round-number deductions, unreported income, and losses on hobby businesses claimed year after year. Stay clean and document everything.",
    createdAt: "2026-01-08T11:30:00Z",
    updatedAt: "2026-01-10T09:00:00Z",
    views: 2980,
    likes: 221,
    replyCount: 28,
    status: "approved",
    reportCount: 0,
    replies: [],
  },
  {
    id: "d5",
    title: "How I identified and escaped a real estate wholesaling scam",
    slug: "real-estate-wholesaling-scam",
    category: "fraud-prevention",
    tags: [
      { id: "t13", label: "scam-alert" },
      { id: "t14", label: "real-estate" },
      { id: "t15", label: "fraud-prevention" },
    ],
    authorId: "m1",
    author: COMMUNITY_MEMBERS[0],
    content:
      "I almost lost $15,000 to a wholesaling scam that looked completely legitimate. Here is how it worked, the red flags I eventually spotted, and how I got out. Please read this before signing any assignment contract from someone you met at a 'free seminar'.",
    createdAt: "2026-02-14T16:00:00Z",
    updatedAt: "2026-02-14T16:00:00Z",
    views: 5640,
    likes: 398,
    replyCount: 73,
    isFeatured: true,
    status: "approved",
    reportCount: 0,
    replies: [],
  },
  {
    id: "d6",
    title: "Building a 6-month emergency fund on a $45k salary",
    slug: "6-month-emergency-fund-45k-salary",
    category: "budgeting",
    tags: [
      { id: "t16", label: "emergency-fund" },
      { id: "t17", label: "savings" },
      { id: "t18", label: "budgeting" },
    ],
    authorId: "m2",
    author: COMMUNITY_MEMBERS[1],
    content:
      "Building a 6-month emergency fund on a modest salary is absolutely achievable. The strategy: calculate your true monthly expenses (not income), open a high-yield savings account, automate a fixed transfer every payday, and treat it as a non-negotiable bill.",
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-03-05T10:30:00Z",
    views: 2100,
    likes: 167,
    replyCount: 19,
    status: "approved",
    reportCount: 0,
    replies: [],
  },
  {
    id: "d7",
    title: "Roth IRA vs Traditional IRA: which is right for your situation?",
    slug: "roth-ira-vs-traditional-ira",
    category: "retirement",
    tags: [
      { id: "t19", label: "roth-ira" },
      { id: "t20", label: "traditional-ira" },
      { id: "t21", label: "retirement" },
    ],
    authorId: "m3",
    author: COMMUNITY_MEMBERS[2],
    content:
      "The Roth vs Traditional IRA question depends on your current and expected future tax rates. Roth: pay taxes now, tax-free growth and withdrawals. Traditional: tax deduction now, pay taxes in retirement. If you expect higher taxes in retirement, Roth wins. If you expect lower taxes, Traditional wins. For most people under 40, Roth is the better choice.",
    createdAt: "2026-03-20T12:00:00Z",
    updatedAt: "2026-03-22T09:00:00Z",
    views: 3890,
    likes: 289,
    replyCount: 44,
    isFeatured: true,
    status: "approved",
    reportCount: 0,
    replies: [],
  },
  {
    id: "d8",
    title: "Starting an LLC: what you actually need and what you can skip",
    slug: "starting-llc-what-you-need",
    category: "entrepreneurship",
    tags: [
      { id: "t22", label: "llc" },
      { id: "t23", label: "business-structure" },
      { id: "t24", label: "entrepreneurship" },
    ],
    authorId: "m4",
    author: COMMUNITY_MEMBERS[3],
    content:
      "After helping a dozen small businesses form LLCs, here is what you actually need: Articles of Organization filed with your state, an Operating Agreement, a separate business bank account, and an EIN. What you can skip initially: expensive registered agent services, complex multi-member structures, and expensive attorneys for a simple single-member LLC.",
    createdAt: "2026-04-05T10:00:00Z",
    updatedAt: "2026-04-07T14:00:00Z",
    views: 4210,
    likes: 334,
    replyCount: 38,
    isStaffPick: true,
    status: "approved",
    reportCount: 0,
    replies: [],
  },
];

export const MODERATION_REPORTS: ModerationReport[] = [
  {
    id: "rep1",
    reporterId: "m6",
    reporter: COMMUNITY_MEMBERS[5],
    targetType: "discussion",
    targetId: "d99",
    targetTitle: "Get rich quick with crypto signals — DM me",
    reason: "spam",
    details: "This looks like a promotional post for a paid crypto signal service.",
    createdAt: "2026-07-01T09:15:00Z",
    status: "open",
  },
  {
    id: "rep2",
    reporterId: "m3",
    reporter: COMMUNITY_MEMBERS[2],
    targetType: "reply",
    targetId: "r99",
    targetTitle: "Reply in thread: Best index funds",
    reason: "misinformation",
    details: "This reply claims a specific stock will return 40% guaranteed, which is misleading.",
    createdAt: "2026-07-02T14:30:00Z",
    status: "open",
  },
  {
    id: "rep3",
    reporterId: "m4",
    reporter: COMMUNITY_MEMBERS[3],
    targetType: "discussion",
    targetId: "d88",
    targetTitle: "Anyone interested in a private lending pool?",
    reason: "inappropriate",
    details: "Soliciting members for an unregistered investment scheme.",
    createdAt: "2026-07-03T11:00:00Z",
    status: "open",
  },
];

export const AUDIT_LOGS: AuditLog[] = [
  {
    id: "al1",
    actorId: "admin1",
    actorName: "Admin",
    action: "removed",
    targetType: "discussion",
    targetId: "d77",
    targetLabel: "Pump and dump scheme — act fast",
    timestamp: "2026-06-28T10:00:00Z",
    details: "Removed for spam and potential fraud solicitation.",
  },
  {
    id: "al2",
    actorId: "admin1",
    actorName: "Admin",
    action: "warned",
    targetType: "user",
    targetId: "u55",
    targetLabel: "user_spam_123",
    timestamp: "2026-06-28T10:05:00Z",
    details: "Issued formal warning for repeated spam posting.",
  },
  {
    id: "al3",
    actorId: "admin1",
    actorName: "Admin",
    action: "approved",
    targetType: "discussion",
    targetId: "d1",
    targetLabel: "How I paid off $42,000 in debt",
    timestamp: "2026-11-03T10:30:00Z",
  },
  {
    id: "al4",
    actorId: "admin1",
    actorName: "Admin",
    action: "suspended",
    targetType: "user",
    targetId: "u66",
    targetLabel: "misleading_tips",
    timestamp: "2026-07-02T15:00:00Z",
    details: "7-day suspension for repeated misinformation.",
  },
];

export const COMMUNITY_STATS: CommunityStats = {
  totalMembers: 14820,
  totalDiscussions: 2899,
  totalPosts: 16300,
  activeToday: 342,
  weeklyGrowth: 8,
};

export function getCategoryMeta(slug: string): ForumCategoryMeta | undefined {
  return FORUM_CATEGORIES.find((c) => c.slug === slug);
}

export function getDiscussionsByCategory(category: string): Discussion[] {
  return DISCUSSIONS.filter((d) => d.category === category);
}

export function getFeaturedDiscussions(): Discussion[] {
  return DISCUSSIONS.filter((d) => d.isFeatured);
}

export function getStaffPicks(): Discussion[] {
  return DISCUSSIONS.filter((d) => d.isStaffPick);
}

export function getPopularDiscussions(): Discussion[] {
  return [...DISCUSSIONS].sort((a, b) => b.likes - a.likes).slice(0, 5);
}

export function getRecentDiscussions(): Discussion[] {
  return [...DISCUSSIONS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
}

export function getDiscussionById(id: string): Discussion | undefined {
  return DISCUSSIONS.find((d) => d.id === id);
}

export function getDiscussionBySlug(slug: string): Discussion | undefined {
  return DISCUSSIONS.find((d) => d.slug === slug);
}

export function searchDiscussions(query: string): Discussion[] {
  const q = query.toLowerCase();
  return DISCUSSIONS.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.content.toLowerCase().includes(q) ||
      d.tags.some((t) => t.label.toLowerCase().includes(q)) ||
      d.category.toLowerCase().includes(q)
  );
}

export const BADGE_LABELS: Record<string, string> = {
  newcomer: "Newcomer",
  contributor: "Contributor",
  trusted: "Trusted Member",
  expert: "Expert",
  champion: "Community Champion",
};

export const BADGE_COLORS: Record<string, string> = {
  newcomer: "border-slate-500 text-slate-300",
  contributor: "border-blue-500 text-blue-300",
  trusted: "border-green-500 text-green-300",
  expert: "border-purple-500 text-purple-300",
  champion: "border-yellow-500 text-yellow-300",
};

export const CATEGORY_LABELS: Record<string, string> = {
  budgeting: "Budgeting",
  credit: "Credit",
  investing: "Investing",
  retirement: "Retirement",
  taxes: "Taxes",
  insurance: "Insurance",
  entrepreneurship: "Entrepreneurship",
  "real-estate": "Real Estate",
  "fraud-prevention": "Fraud Prevention",
  general: "General",
};
