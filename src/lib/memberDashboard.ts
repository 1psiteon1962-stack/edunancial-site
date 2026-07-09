export type RecommendationCategory =
  | "Personal Finance"
  | "Credit"
  | "Budgeting"
  | "Investing"
  | "Taxes"
  | "Insurance"
  | "Real Estate"
  | "Entrepreneurship";

export interface DashboardOverviewItem {
  label: string;
  value: string;
  supportingText: string;
}

export interface ContinueLearningCourse {
  id: string;
  title: string;
  category: RecommendationCategory;
  progress: number;
  estimatedTimeRemaining: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
}

export interface DashboardRecommendation {
  id: string;
  title: string;
  category: RecommendationCategory;
  description: string;
  reason: string;
  href: string;
}

export interface FinancialToolShortcut {
  id: string;
  title: string;
  description: string;
  href: string;
  available: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progressLabel: string;
}

export interface CategoryCompletion {
  category: RecommendationCategory;
  completion: number;
  lessonsCompleted: number;
  totalLessons: number;
}

export interface WeeklyActivityPoint {
  day: string;
  minutes: number;
}

export interface MonthlyGoal {
  completedHours: number;
  targetHours: number;
}

export interface AnnouncementItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export interface MotivationalQuote {
  quote: string;
  author: string;
}

export interface MemberDashboardData {
  memberName: string;
  overview: DashboardOverviewItem[];
  continueLearning: ContinueLearningCourse[];
  recommendations: DashboardRecommendation[];
  financialTools: FinancialToolShortcut[];
  achievementBadges: AchievementBadge[];
  overallCompletion: number;
  categoryCompletion: CategoryCompletion[];
  weeklyActivity: WeeklyActivityPoint[];
  monthlyGoal: MonthlyGoal;
  announcements: AnnouncementItem[];
  motivationalQuotes: MotivationalQuote[];
}

const categoryCatalog: Array<
  Omit<DashboardRecommendation, "reason"> & { placeholderReason: string }
> = [
  {
    id: "personal-finance-roadmap",
    title: "Personal Finance Reset",
    category: "Personal Finance",
    description: "Strengthen cash-flow habits, goal setting, and confident money routines.",
    href: "/courses",
    placeholderReason: "Recommended to reinforce everyday money decisions before moving into advanced tracks.",
  },
  {
    id: "credit-confidence",
    title: "Credit Confidence Blueprint",
    category: "Credit",
    description: "Learn how credit history, utilization, and repayment habits affect opportunity.",
    href: "/courses",
    placeholderReason: "Recommended because your completed coursework shows room to improve credit fundamentals.",
  },
  {
    id: "budgeting-systems",
    title: "Budgeting Systems That Stick",
    category: "Budgeting",
    description: "Build a repeatable spending plan with practical guardrails and review habits.",
    href: "/courses",
    placeholderReason: "Recommended to support the budgeting tools you are already using inside Edunancial.",
  },
  {
    id: "investing-basics",
    title: "Investing Foundations",
    category: "Investing",
    description: "Understand risk, compounding, diversification, and long-term portfolio habits.",
    href: "/courses",
    placeholderReason: "Recommended as the next step after your recent progress in core wealth-building topics.",
  },
  {
    id: "tax-smart-decisions",
    title: "Tax-Smart Financial Decisions",
    category: "Taxes",
    description: "Explore how taxes shape savings, investing, and business cash-flow strategy.",
    href: "/courses",
    placeholderReason: "Recommended to connect your current learning streak with practical year-round tax awareness.",
  },
  {
    id: "insurance-basics",
    title: "Insurance Essentials",
    category: "Insurance",
    description: "Review protection planning, risk transfer, and coverage choices for major life events.",
    href: "/courses",
    placeholderReason: "Recommended because protection planning is a key gap after your completed starter courses.",
  },
  {
    id: "real-estate-primer",
    title: "Real Estate Investing Primer",
    category: "Real Estate",
    description: "Compare property strategies, leverage, and long-term wealth-building opportunities.",
    href: "/courses",
    placeholderReason: "Recommended because this category is close to your current average and ready for a deeper push.",
  },
  {
    id: "entrepreneurship-cashflow",
    title: "Entrepreneurship Cash-Flow Playbook",
    category: "Entrepreneurship",
    description: "Learn how founders can manage pricing, runway, and growth-minded financial decisions.",
    href: "/courses",
    placeholderReason: "Recommended to expand your completed coursework into business ownership and income creation.",
  },
];

function createCourseImage(title: string, accentColor: string, detailColor: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" role="img" aria-label="${title}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="${accentColor}" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" rx="36" fill="url(#g)" />
      <circle cx="645" cy="95" r="96" fill="${detailColor}" fill-opacity="0.22" />
      <circle cx="125" cy="355" r="118" fill="#facc15" fill-opacity="0.08" />
      <text x="60" y="165" fill="#f8fafc" font-family="Arial, sans-serif" font-size="28" font-weight="700">Continue Learning</text>
      <text x="60" y="225" fill="#f8fafc" font-family="Arial, sans-serif" font-size="54" font-weight="800">${title}</text>
      <text x="60" y="300" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="24">Financial competency in action</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getPlaceholderRecommendations(
  categoryCompletion: CategoryCompletion[],
) {
  const completionLookup = new Map(
    categoryCompletion.map((entry) => [entry.category, entry.completion]),
  );

  return [...categoryCatalog]
    .sort(
      (left, right) =>
        (completionLookup.get(left.category) ?? 0) -
        (completionLookup.get(right.category) ?? 0),
    )
    .map(({ placeholderReason, ...recommendation }) => ({
      ...recommendation,
      reason: placeholderReason,
    }));
}

export function getMemberDashboardData(): MemberDashboardData {
  const categoryCompletion: CategoryCompletion[] = [
    { category: "Budgeting", completion: 82, lessonsCompleted: 14, totalLessons: 17 },
    { category: "Personal Finance", completion: 74, lessonsCompleted: 17, totalLessons: 23 },
    { category: "Investing", completion: 67, lessonsCompleted: 12, totalLessons: 18 },
    { category: "Credit", completion: 61, lessonsCompleted: 11, totalLessons: 18 },
    { category: "Taxes", completion: 48, lessonsCompleted: 7, totalLessons: 15 },
    { category: "Insurance", completion: 41, lessonsCompleted: 5, totalLessons: 12 },
    { category: "Real Estate", completion: 58, lessonsCompleted: 10, totalLessons: 17 },
    { category: "Entrepreneurship", completion: 53, lessonsCompleted: 8, totalLessons: 15 },
  ];

  const continueLearning: ContinueLearningCourse[] = [
    {
      id: "cash-flow-confidence",
      title: "Cash-Flow Confidence",
      category: "Budgeting",
      progress: 84,
      estimatedTimeRemaining: "18 minutes remaining",
      href: "/courses",
      imageSrc: createCourseImage("Cash-Flow Confidence", "#2563eb", "#38bdf8"),
      imageAlt: "Illustrated cover for the Cash-Flow Confidence course.",
    },
    {
      id: "credit-repair-basics",
      title: "Credit Repair Basics",
      category: "Credit",
      progress: 56,
      estimatedTimeRemaining: "42 minutes remaining",
      href: "/courses",
      imageSrc: createCourseImage("Credit Repair Basics", "#7c3aed", "#c084fc"),
      imageAlt: "Illustrated cover for the Credit Repair Basics course.",
    },
    {
      id: "investing-with-purpose",
      title: "Investing With Purpose",
      category: "Investing",
      progress: 31,
      estimatedTimeRemaining: "1 hour 12 minutes remaining",
      href: "/courses",
      imageSrc: createCourseImage("Investing With Purpose", "#0f766e", "#2dd4bf"),
      imageAlt: "Illustrated cover for the Investing With Purpose course.",
    },
  ];

  return {
    memberName: "Taylor",
    overview: [
      { label: "Courses Started", value: "5", supportingText: "3 currently active this week" },
      { label: "Courses Completed", value: "3", supportingText: "1 completed in the last 30 days" },
      { label: "Learning Progress", value: "62%", supportingText: "Across active learning plans" },
      { label: "Tools Used", value: "3", supportingText: "Budget, investment, and net worth tools" },
      { label: "Current Learning Streak", value: "12 days", supportingText: "Keep your weekly rhythm going" },
      { label: "Certificates Earned", value: "1", supportingText: "Placeholder for future certificate sync" },
    ],
    continueLearning,
    recommendations: getPlaceholderRecommendations(categoryCompletion),
    financialTools: [
      {
        id: "budget-calculator",
        title: "Budget Calculator",
        description: "Review monthly cash flow and identify surplus or deficit quickly.",
        href: "/financial-tools",
        available: true,
      },
      {
        id: "net-worth-tracker",
        title: "Net Worth Tracker",
        description: "Track assets and debts to measure long-term financial progress.",
        href: "/financial-tools",
        available: true,
      },
      {
        id: "investment-calculator",
        title: "Investment Calculator",
        description: "Estimate long-term growth and understand compounding scenarios.",
        href: "/financial-tools",
        available: true,
      },
      {
        id: "retirement-calculator",
        title: "Retirement Calculator",
        description: "Project future retirement readiness with contribution planning.",
        href: "/financial-tools",
        available: false,
      },
      {
        id: "debt-planner",
        title: "Debt Planner",
        description: "Compare payoff strategies and build a future debt-reduction roadmap.",
        href: "/financial-tools",
        available: false,
      },
      {
        id: "mortgage-calculator",
        title: "Mortgage Calculator",
        description: "Explore payment scenarios, affordability ranges, and next-home planning.",
        href: "/financial-tools",
        available: false,
      },
    ],
    achievementBadges: [
      {
        id: "first-lesson-completed",
        title: "First Lesson Completed",
        description: "Complete your first lesson to begin tracking momentum.",
        icon: "✓",
        earned: true,
        progressLabel: "Earned",
      },
      {
        id: "budget-builder",
        title: "Budget Builder",
        description: "Finish the budgeting pathway and use the calculator at least once.",
        icon: "¤",
        earned: true,
        progressLabel: "Earned",
      },
      {
        id: "debt-crusher",
        title: "Debt Crusher",
        description: "Complete two debt reduction modules and build a payoff plan.",
        icon: "↘",
        earned: false,
        progressLabel: "1 of 2 modules completed",
      },
      {
        id: "investing-beginner",
        title: "Investing Beginner",
        description: "Finish your first investing course and record a practice scenario.",
        icon: "↑",
        earned: false,
        progressLabel: "31% complete",
      },
      {
        id: "savings-champion",
        title: "Savings Champion",
        description: "Maintain a positive monthly surplus for four consecutive weeks.",
        icon: "★",
        earned: true,
        progressLabel: "Earned",
      },
      {
        id: "financial-literacy-explorer",
        title: "Financial Literacy Explorer",
        description: "Touch four learning categories to broaden your money knowledge.",
        icon: "◎",
        earned: false,
        progressLabel: "3 of 4 categories explored",
      },
    ],
    overallCompletion: 62,
    categoryCompletion,
    weeklyActivity: [
      { day: "Mon", minutes: 25 },
      { day: "Tue", minutes: 40 },
      { day: "Wed", minutes: 30 },
      { day: "Thu", minutes: 55 },
      { day: "Fri", minutes: 20 },
      { day: "Sat", minutes: 45 },
      { day: "Sun", minutes: 35 },
    ],
    monthlyGoal: {
      completedHours: 9.5,
      targetHours: 14,
    },
    announcements: [
      {
        id: "new-course",
        tag: "New Course",
        title: "Personal Finance Reset is now live",
        description: "Start the newest learner-friendly course focused on everyday money confidence.",
        href: "/courses",
        cta: "View course",
      },
      {
        id: "website-update",
        tag: "Website Update",
        title: "Financial tools have a faster entry point",
        description: "Quick-access shortcuts now prioritize calculators that are already available today.",
        href: "/financial-tools",
        cta: "Open tools",
      },
      {
        id: "upcoming-webinar",
        tag: "Upcoming Webinar",
        title: "Join the next live budgeting workshop",
        description: "Reserve your spot for a guided session on building a spending plan that lasts.",
        href: "/webinars",
        cta: "See webinars",
      },
      {
        id: "member-news",
        tag: "Member News",
        title: "Achievement badges are expanding soon",
        description: "More badge unlocks and certificate sync points are planned for future dashboard updates.",
        href: "/membership",
        cta: "Learn more",
      },
    ],
    motivationalQuotes: [
      {
        quote: "The best investment you can make is in yourself.",
        author: "Warren Buffett",
      },
      {
        quote: "Do not save what is left after spending, but spend what is left after saving.",
        author: "Warren Buffett",
      },
      {
        quote: "A budget is telling your money where to go instead of wondering where it went.",
        author: "Dave Ramsey",
      },
    ],
  };
}
