// ─────────────────────────────────────────────────────────────
// Course Platform Data Model
// ─────────────────────────────────────────────────────────────

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type CourseCategory =
  | "Real Estate"
  | "Paper Assets"
  | "Business"
  | "Financial Foundations"
  | "Economic Self Defense"
  | "Family Learning"
  | "Teen Entrepreneurs"
  | "Executive Learning";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  lessonId?: string;
  courseId?: string;
  passingScore: number; // percent
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string; // e.g. "12 min"
  videoUrl: string;
  description: string;
  notes: string;
  order: number;
  quizId?: string;
  downloadUrl?: string;
  transcript?: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  courses: string[];
  students: number;
  rating: number;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: CourseCategory;
  difficulty: Difficulty;
  instructor: string; // instructor id
  lessons: string[]; // lesson ids
  quizzes: string[]; // quiz ids
  totalDuration: string;
  enrolledCount: number;
  rating: number;
  reviewCount: number;
  thumbnail: string;
  color: string; // tailwind bg class
  tags: string[];
  certificateId?: string;
  isFeatured?: boolean;
  isFree?: boolean;
  price?: number;
}

// ─────────────────────────────────────────────────────────────
// Instructors
// ─────────────────────────────────────────────────────────────

export const instructors: Record<string, Instructor> = {
  "edunancial-team": {
    id: "edunancial-team",
    name: "Edunancial Faculty",
    title: "Certified Financial Educators",
    bio: "The Edunancial Faculty is a team of certified financial educators, real estate professionals, and business strategists with a combined 60+ years of real-world experience building wealth and training others to do the same.",
    avatar: "/images/instructor-team.jpg",
    courses: ["red-real-estate", "white-paper-assets", "blue-business", "financial-foundations"],
    students: 12400,
    rating: 4.9,
  },
  "red-instructor": {
    id: "red-instructor",
    name: "Edunancial Team",
    title: "Real Estate Education — To Be Announced",
    bio: "Instructor details for the RED Real Estate track will be announced prior to launch. Course content is developed by the Edunancial Team.",
    avatar: "/images/instructor-team.jpg",
    courses: ["red-real-estate"],
    students: 5800,
    rating: 4.8,
  },
  "white-instructor": {
    id: "white-instructor",
    name: "Edunancial Team",
    title: "Paper Assets Education — To Be Announced",
    bio: "Instructor details for the WHITE Paper Assets track will be announced prior to launch. Course content is developed by the Edunancial Team.",
    avatar: "/images/instructor-team.jpg",
    courses: ["white-paper-assets"],
    students: 6200,
    rating: 4.9,
  },
  "blue-instructor": {
    id: "blue-instructor",
    name: "Edunancial Team",
    title: "Business Education — To Be Announced",
    bio: "Instructor details for the BLUE Business track will be announced prior to launch. Course content is developed by the Edunancial Team.",
    avatar: "/images/instructor-team.jpg",
    courses: ["blue-business"],
    students: 4900,
    rating: 4.7,
  },
};

// ─────────────────────────────────────────────────────────────
// Quizzes
// ─────────────────────────────────────────────────────────────

export const quizzes: Record<string, Quiz> = {
  "quiz-real-estate-intro": {
    id: "quiz-real-estate-intro",
    title: "Real Estate Foundations Quiz",
    courseId: "red-real-estate",
    lessonId: "red-01",
    passingScore: 70,
    questions: [
      {
        id: "q1",
        question: "What is the primary advantage of rental property income over earned income?",
        options: [
          "It is always higher in amount",
          "It is passive and can compound over time",
          "It requires no initial capital",
          "It is tax-free in all states",
        ],
        correctIndex: 1,
        explanation: "Rental income is passive — it works while you sleep. Over time, rent increases and equity growth compound your wealth.",
      },
      {
        id: "q2",
        question: "A tax lien certificate represents:",
        options: [
          "Ownership of the property",
          "A government loan to the property owner",
          "A debt the property owner owes in back taxes",
          "An insurance policy on the property",
        ],
        correctIndex: 2,
        explanation: "A tax lien is placed on a property when the owner fails to pay property taxes. The certificate holder has priority claim on the debt.",
      },
      {
        id: "q3",
        question: "In a 1031 Exchange, the investor must identify a replacement property within:",
        options: ["30 days", "45 days", "60 days", "90 days"],
        correctIndex: 1,
        explanation: "IRS rules require identification of a like-kind replacement property within 45 days of the original property sale.",
      },
      {
        id: "q4",
        question: "Creative financing in real estate most commonly refers to:",
        options: [
          "Using only cash to purchase property",
          "Acquiring property without traditional bank financing",
          "Flipping properties for quick profit",
          "Using a real estate agent",
        ],
        correctIndex: 1,
        explanation: "Creative financing includes seller financing, lease options, subject-to, and other non-bank methods of acquiring real estate.",
      },
    ],
  },
  "quiz-paper-assets-intro": {
    id: "quiz-paper-assets-intro",
    title: "Paper Assets Foundations Quiz",
    courseId: "white-paper-assets",
    lessonId: "white-01",
    passingScore: 70,
    questions: [
      {
        id: "q1",
        question: "What does an ETF stand for?",
        options: [
          "Earned Tax Fund",
          "Equity Transfer Form",
          "Exchange-Traded Fund",
          "Economic Trade Framework",
        ],
        correctIndex: 2,
        explanation: "An ETF (Exchange-Traded Fund) is a basket of securities that trades on a stock exchange, offering diversification with low fees.",
      },
      {
        id: "q2",
        question: "The 50/30/20 budgeting rule allocates 20% to:",
        options: ["Wants", "Needs", "Savings and investments", "Taxes"],
        correctIndex: 2,
        explanation: "The 50/30/20 rule: 50% needs, 30% wants, 20% savings and debt payoff.",
      },
      {
        id: "q3",
        question: "Which precious metal is most commonly used as an inflation hedge?",
        options: ["Silver", "Platinum", "Gold", "Palladium"],
        correctIndex: 2,
        explanation: "Gold has historically been the primary store of value and inflation hedge due to its scarcity and universal acceptance.",
      },
      {
        id: "q4",
        question: "A Roth IRA contribution grows:",
        options: [
          "Tax-deferred and taxed on withdrawal",
          "Tax-free and is not taxed on qualified withdrawal",
          "Without any contribution limits",
          "Only through employer matching",
        ],
        correctIndex: 1,
        explanation: "Roth IRA contributions are made with after-tax dollars. Qualified withdrawals in retirement are completely tax-free.",
      },
    ],
  },
  "quiz-business-intro": {
    id: "quiz-business-intro",
    title: "Business Competency Quiz",
    courseId: "blue-business",
    lessonId: "blue-01",
    passingScore: 70,
    questions: [
      {
        id: "q1",
        question: "What does KPI stand for?",
        options: [
          "Key Profit Index",
          "Key Performance Indicator",
          "Known Profit Income",
          "Key Product Investment",
        ],
        correctIndex: 1,
        explanation: "A KPI (Key Performance Indicator) is a measurable value that demonstrates how effectively a business is achieving its objectives.",
      },
      {
        id: "q2",
        question: "Gross profit margin is calculated as:",
        options: [
          "(Revenue − Operating Expenses) / Revenue",
          "(Revenue − COGS) / Revenue",
          "Net Income / Total Assets",
          "Revenue / Total Expenses",
        ],
        correctIndex: 1,
        explanation: "Gross Profit Margin = (Revenue − Cost of Goods Sold) / Revenue × 100. It measures production efficiency.",
      },
      {
        id: "q3",
        question: "The Profit First system prioritizes:",
        options: [
          "Revenue over everything",
          "Expenses before profit",
          "Taking profit first, then managing expenses",
          "Growth at the expense of profit",
        ],
        correctIndex: 2,
        explanation: "Profit First (by Mike Michalowicz) flips the formula: Revenue − Profit = Expenses, ensuring profit is never an afterthought.",
      },
      {
        id: "q4",
        question: "Customer Acquisition Cost (CAC) should always be compared to:",
        options: [
          "Revenue",
          "Customer Lifetime Value (CLV)",
          "Gross Margin",
          "Operating Costs",
        ],
        correctIndex: 1,
        explanation: "CAC must be less than CLV for a sustainable business model. A healthy CLV:CAC ratio is 3:1 or better.",
      },
    ],
  },
  "quiz-financial-foundations": {
    id: "quiz-financial-foundations",
    title: "Financial Foundations Final Quiz",
    courseId: "financial-foundations",
    passingScore: 75,
    questions: [
      {
        id: "q1",
        question: "Financial literacy is best defined as:",
        options: [
          "The ability to earn a high income",
          "Knowledge and skills to make informed financial decisions",
          "Owning investments",
          "Having a college degree in finance",
        ],
        correctIndex: 1,
        explanation: "Financial literacy is the ability to understand and apply financial concepts to make sound personal and business decisions.",
      },
      {
        id: "q2",
        question: "The Rule of 72 helps you estimate:",
        options: [
          "Your tax bracket",
          "How long to pay off debt",
          "How long it takes to double your money",
          "Monthly cash flow",
        ],
        correctIndex: 2,
        explanation: "Divide 72 by the annual interest rate to estimate how many years it takes to double your money. E.g., 72 ÷ 8% = 9 years.",
      },
      {
        id: "q3",
        question: "Compound interest differs from simple interest because:",
        options: [
          "It is always higher",
          "Interest earns interest over time",
          "It requires a minimum balance",
          "It never decreases",
        ],
        correctIndex: 1,
        explanation: "Compound interest calculates interest on both the principal and the accumulated interest, creating exponential growth.",
      },
      {
        id: "q4",
        question: "An emergency fund should ideally cover:",
        options: [
          "1 month of expenses",
          "3–6 months of expenses",
          "12 months of expenses",
          "Only housing costs",
        ],
        correctIndex: 1,
        explanation: "Financial advisors recommend 3–6 months of living expenses in a liquid emergency fund before investing.",
      },
      {
        id: "q5",
        question: "Which of the following is considered a liability?",
        options: [
          "A rental property generating positive cash flow",
          "A savings account",
          "A car loan with monthly payments",
          "A stock portfolio",
        ],
        correctIndex: 2,
        explanation: "A liability takes money out of your pocket. A car loan with payments is a liability; an income-producing asset is not.",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// Lessons
// ─────────────────────────────────────────────────────────────

export const lessons: Record<string, Lesson> = {
  // RED — Real Estate
  "red-01": {
    id: "red-01",
    courseId: "red-real-estate",
    title: "Introduction to Real Estate Investing",
    duration: "18 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Overview of the RED track: rental properties, tax liens, tax deeds, creative financing, and 1031 exchanges.",
    notes: "Real estate is one of the oldest and most reliable wealth-building vehicles. In this lesson we cover the mindset shift required to see real estate as a business, not just a purchase.",
    order: 1,
    quizId: "quiz-real-estate-intro",
    downloadUrl: "/downloads/red-01-notes.pdf",
  },
  "red-02": {
    id: "red-02",
    courseId: "red-real-estate",
    title: "Rental Properties: Cash Flow Analysis",
    duration: "24 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "How to analyze a rental property for positive cash flow using the 1% rule, cap rate, and NOI.",
    notes: "Key formulas: NOI = Gross Rent − Vacancy − Operating Expenses. Cap Rate = NOI / Purchase Price. Cash on Cash Return = Annual Cash Flow / Total Cash Invested.",
    order: 2,
    downloadUrl: "/downloads/red-02-cashflow.pdf",
  },
  "red-03": {
    id: "red-03",
    courseId: "red-real-estate",
    title: "Tax Liens: Earning Interest on Debt",
    duration: "20 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "How tax lien certificates work, how to bid at auctions, and how to earn 8–36% annual returns.",
    notes: "Tax liens are government-backed investments. When you purchase a tax lien, the property owner must pay you back with interest. If they don't, you can foreclose.",
    order: 3,
  },
  "red-04": {
    id: "red-04",
    courseId: "red-real-estate",
    title: "Tax Deeds: Acquiring Property at Auction",
    duration: "22 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Understanding tax deed sales, due diligence process, and how to acquire properties below market value.",
    notes: "A tax deed transfers ownership when a lien goes unpaid for an extended period. You can purchase real property outright at county auctions for pennies on the dollar.",
    order: 4,
  },
  "red-05": {
    id: "red-05",
    courseId: "red-real-estate",
    title: "Creative Financing Strategies",
    duration: "28 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Seller financing, lease options, subject-to, wraparound mortgages, and BRRRR method.",
    notes: "Creative financing allows you to acquire properties with little to no money down by structuring deals outside the traditional banking system.",
    order: 5,
  },
  "red-06": {
    id: "red-06",
    courseId: "red-real-estate",
    title: "1031 Exchanges: Defer Capital Gains",
    duration: "16 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "How to use IRS Section 1031 to defer capital gains taxes and scale your real estate portfolio.",
    notes: "The 1031 Exchange is one of the most powerful tax deferral tools available to real estate investors. Identify replacement property within 45 days, close within 180 days.",
    order: 6,
  },
  // WHITE — Paper Assets
  "white-01": {
    id: "white-01",
    courseId: "white-paper-assets",
    title: "Introduction to Financial Assets",
    duration: "15 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Overview of the WHITE track: budgeting, stocks, ETFs, options, precious metals, and retirement accounts.",
    notes: "Paper assets are financial instruments like stocks, bonds, and funds. They offer liquidity and scalability that physical assets cannot match.",
    order: 1,
    quizId: "quiz-paper-assets-intro",
  },
  "white-02": {
    id: "white-02",
    courseId: "white-paper-assets",
    title: "Budgeting for Wealth Building",
    duration: "20 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Build a bulletproof budget using the 50/30/20 rule, zero-based budgeting, and cash flow tracking.",
    notes: "A budget isn't a restriction — it's a plan for your money. Track every dollar and assign it a purpose before the month begins.",
    order: 2,
    downloadUrl: "/downloads/white-02-budget-template.pdf",
  },
  "white-03": {
    id: "white-03",
    courseId: "white-paper-assets",
    title: "Stocks: Fundamentals & Analysis",
    duration: "26 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "How to read financial statements, evaluate P/E ratios, and identify quality companies to invest in.",
    notes: "Fundamental analysis focuses on a company's financial health. Key ratios: P/E, P/B, Debt-to-Equity, Free Cash Flow Yield.",
    order: 3,
  },
  "white-04": {
    id: "white-04",
    courseId: "white-paper-assets",
    title: "ETFs: Diversification Made Simple",
    duration: "18 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "How exchange-traded funds work, expense ratios, index investing, and building a diversified portfolio.",
    notes: "ETFs track an index, commodity, or sector. A low-cost S&P 500 ETF has historically returned 10% annually over long periods.",
    order: 4,
  },
  "white-05": {
    id: "white-05",
    courseId: "white-paper-assets",
    title: "Options Trading Basics",
    duration: "30 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Calls, puts, strike price, expiration, the Greeks, and how to use options to generate income.",
    notes: "Options give you the right, not the obligation, to buy or sell. Covered calls generate income. Protective puts limit downside risk.",
    order: 5,
  },
  "white-06": {
    id: "white-06",
    courseId: "white-paper-assets",
    title: "Precious Metals as a Hedge",
    duration: "16 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Gold, silver, platinum — how to buy, store, and use precious metals as an inflation hedge.",
    notes: "Precious metals preserve purchasing power. The recommended allocation is 5–15% of an investment portfolio in physical gold and silver.",
    order: 6,
  },
  "white-07": {
    id: "white-07",
    courseId: "white-paper-assets",
    title: "Retirement Accounts: IRA, Roth, 401k",
    duration: "22 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Traditional vs. Roth IRAs, 401(k) matching, SEP IRA for self-employed, and self-directed IRA.",
    notes: "Max contributions: IRA $7,000/year (2024), 401(k) $23,000/year. Always capture full employer match — it's free money.",
    order: 7,
    quizId: "quiz-paper-assets-intro",
  },
  // BLUE — Business
  "blue-01": {
    id: "blue-01",
    courseId: "blue-business",
    title: "Introduction to Business Competency",
    duration: "14 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Overview of the BLUE track: entrepreneurship, marketing, KPIs, pricing, and scaling.",
    notes: "Business competency means understanding every critical number in your business and making decisions based on data, not emotion.",
    order: 1,
    quizId: "quiz-business-intro",
  },
  "blue-02": {
    id: "blue-02",
    courseId: "blue-business",
    title: "Entrepreneurship Mindset",
    duration: "20 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "The difference between self-employment and entrepreneurship, risk tolerance, and building systems.",
    notes: "An entrepreneur builds a system that works without them. A self-employed person has bought themselves a job. The goal is to engineer yourself out of the daily operations.",
    order: 2,
  },
  "blue-03": {
    id: "blue-03",
    courseId: "blue-business",
    title: "KPIs: Running on Data",
    duration: "25 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "How to select, track, and act on the 10 most important KPIs for any business.",
    notes: "Your dashboard KPIs: Revenue, Gross Margin, CAC, CLV, Churn Rate, Net Profit Margin, Inventory Turnover, Receivables Days, Employee Productivity, NPS.",
    order: 3,
    quizId: "quiz-business-intro",
    downloadUrl: "/downloads/blue-03-kpi-tracker.pdf",
  },
  "blue-04": {
    id: "blue-04",
    courseId: "blue-business",
    title: "Marketing: Attract. Convert. Retain.",
    duration: "28 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Building a marketing system using content, email, social, and referrals to generate predictable leads.",
    notes: "Marketing framework: Awareness → Interest → Decision → Action → Loyalty. Build a system for each stage of the funnel.",
    order: 4,
  },
  "blue-05": {
    id: "blue-05",
    courseId: "blue-business",
    title: "Pricing Strategy for Profit",
    duration: "18 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Value-based pricing, cost-plus pricing, competitive pricing, and how to raise prices without losing customers.",
    notes: "Most businesses underprice. Value-based pricing anchors to the transformation you provide, not the time you spend.",
    order: 5,
  },
  "blue-06": {
    id: "blue-06",
    courseId: "blue-business",
    title: "Profit: Taking Money Seriously",
    duration: "22 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Profit First methodology, owner's pay, tax allocation, and building a sustainable profit-generating business.",
    notes: "Profit First allocation: Revenue → Owner Pay (10%) → Profit (5%) → Tax (15%) → Operating Expenses (70%). Adjust ratios as revenue grows.",
    order: 6,
  },
  "blue-07": {
    id: "blue-07",
    courseId: "blue-business",
    title: "Scaling: Systems Over Hustle",
    duration: "24 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "How to build standard operating procedures, delegate effectively, and scale revenue without increasing your hours.",
    notes: "Scaling requires systems. Document every repeatable process. Hire for talent, train for skill, and build with systems.",
    order: 7,
  },
  // Financial Foundations
  "ff-01": {
    id: "ff-01",
    courseId: "financial-foundations",
    title: "What Is Financial Literacy?",
    duration: "12 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "The foundation of all financial education: understanding money, how it works, and why most people lose.",
    notes: "Financial literacy is not taught in schools by design. Your job is to self-educate and then act on what you learn.",
    order: 1,
  },
  "ff-02": {
    id: "ff-02",
    courseId: "financial-foundations",
    title: "Assets vs. Liabilities",
    duration: "14 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "The rich vs. poor vs. middle class asset column — understanding what puts money in your pocket.",
    notes: "Assets put money IN your pocket. Liabilities take money OUT. Most people's homes, cars, and consumer debt are liabilities.",
    order: 2,
  },
  "ff-03": {
    id: "ff-03",
    courseId: "financial-foundations",
    title: "The Power of Compound Interest",
    duration: "10 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "How compound interest works, the Rule of 72, and why starting early is the most powerful financial decision.",
    notes: "Rule of 72: Divide 72 by your interest rate to find doubling time. At 8%, money doubles every 9 years. At 12%, every 6 years.",
    order: 3,
  },
  "ff-04": {
    id: "ff-04",
    courseId: "financial-foundations",
    title: "Income Streams & Passive Income",
    duration: "16 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "The 7 income streams of millionaires and how to begin building passive and portfolio income.",
    notes: "The average millionaire has 7 income streams: earned, profit, interest, dividend, rental, capital gains, royalty. Start building additional streams immediately.",
    order: 4,
  },
  "ff-05": {
    id: "ff-05",
    courseId: "financial-foundations",
    title: "Debt: Enemy or Tool?",
    duration: "18 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Good debt vs. bad debt, the debt avalanche vs. snowball methods, and leveraging debt to build wealth.",
    notes: "Good debt creates income greater than its cost. Bad debt funds consumption. Destroy bad debt first, then leverage good debt strategically.",
    order: 5,
    quizId: "quiz-financial-foundations",
    downloadUrl: "/downloads/ff-05-debt-worksheet.pdf",
  },
};

// ─────────────────────────────────────────────────────────────
// Courses
// ─────────────────────────────────────────────────────────────

export const courses: Record<string, Course> = {
  "red-real-estate": {
    id: "red-real-estate",
    title: "RED: Real Estate Competency",
    subtitle: "Build wealth through real estate — rentals, tax liens, tax deeds, and creative financing.",
    description: "The RED track covers every major real estate investing strategy from rental properties to tax liens, tax deeds, creative financing structures, and 1031 exchanges. You will learn how to analyze deals, evaluate cash flow, acquire properties with little to no money, and build a real estate portfolio that generates passive income.",
    category: "Real Estate",
    difficulty: "Intermediate",
    instructor: "red-instructor",
    lessons: ["red-01", "red-02", "red-03", "red-04", "red-05", "red-06"],
    quizzes: ["quiz-real-estate-intro"],
    totalDuration: "2h 8min",
    enrolledCount: 5840,
    rating: 4.8,
    reviewCount: 412,
    thumbnail: "/images/course-red.jpg",
    color: "bg-red-700",
    tags: ["Real Estate", "Passive Income", "Tax Liens", "Rentals", "Creative Financing"],
    certificateId: "cert-red",
    isFeatured: true,
  },
  "white-paper-assets": {
    id: "white-paper-assets",
    title: "WHITE: Paper Assets Competency",
    subtitle: "Master stocks, ETFs, options, precious metals, and retirement accounts.",
    description: "The WHITE track builds your financial asset intelligence from the ground up. Starting with budgeting and cash flow, you'll advance through equity investing, ETF portfolio construction, options strategies, precious metals, and retirement account optimization. Every lesson delivers actionable, real-world strategies.",
    category: "Paper Assets",
    difficulty: "Beginner",
    instructor: "white-instructor",
    lessons: ["white-01", "white-02", "white-03", "white-04", "white-05", "white-06", "white-07"],
    quizzes: ["quiz-paper-assets-intro"],
    totalDuration: "2h 27min",
    enrolledCount: 6220,
    rating: 4.9,
    reviewCount: 531,
    thumbnail: "/images/course-white.jpg",
    color: "bg-slate-200 text-slate-900",
    tags: ["Investing", "Stocks", "ETFs", "Retirement", "Budgeting"],
    certificateId: "cert-white",
    isFeatured: true,
  },
  "blue-business": {
    id: "blue-business",
    title: "BLUE: Business Competency",
    subtitle: "Launch, run, and scale a profitable business using proven systems and data.",
    description: "The BLUE track covers every critical business skill from entrepreneurship mindset and marketing systems to KPI dashboards, pricing strategy, profit optimization, and scalable operations. Whether you're starting a business or trying to grow one, this track gives you the exact framework to build a profitable enterprise.",
    category: "Business",
    difficulty: "Intermediate",
    instructor: "blue-instructor",
    lessons: ["blue-01", "blue-02", "blue-03", "blue-04", "blue-05", "blue-06", "blue-07"],
    quizzes: ["quiz-business-intro"],
    totalDuration: "2h 31min",
    enrolledCount: 4910,
    rating: 4.7,
    reviewCount: 348,
    thumbnail: "/images/course-blue.jpg",
    color: "bg-blue-700",
    tags: ["Business", "Entrepreneurship", "KPIs", "Marketing", "Profit"],
    certificateId: "cert-blue",
    isFeatured: true,
  },
  "financial-foundations": {
    id: "financial-foundations",
    title: "Financial Foundations",
    subtitle: "The essential financial education every person needs but was never taught.",
    description: "Financial Foundations is the starting point for every Edunancial student. This course covers the core concepts of money, assets vs. liabilities, compound interest, income streams, and debt strategy. If you're new to financial education, start here. If you're experienced, use this to fill the gaps.",
    category: "Financial Foundations",
    difficulty: "Beginner",
    instructor: "edunancial-team",
    lessons: ["ff-01", "ff-02", "ff-03", "ff-04", "ff-05"],
    quizzes: ["quiz-financial-foundations"],
    totalDuration: "1h 10min",
    enrolledCount: 12400,
    rating: 4.9,
    reviewCount: 1024,
    thumbnail: "/images/course-foundations.jpg",
    color: "bg-yellow-600",
    tags: ["Foundations", "Beginner", "Money", "Assets", "Debt"],
    certificateId: "cert-foundations",
    isFeatured: true,
    isFree: true,
  },
  "economic-self-defense": {
    id: "economic-self-defense",
    title: "Economic Self Defense",
    subtitle: "Protect your wealth from inflation, taxes, and economic instability.",
    description: "Economic Self Defense teaches you how to protect what you've built from the forces working against you: inflation, predatory lending, tax traps, economic downturns, and financial scams. This course is your armor.",
    category: "Economic Self Defense",
    difficulty: "Intermediate",
    instructor: "edunancial-team",
    lessons: ["ff-01", "ff-02", "ff-03"],
    quizzes: ["quiz-financial-foundations"],
    totalDuration: "1h 45min",
    enrolledCount: 3200,
    rating: 4.8,
    reviewCount: 218,
    thumbnail: "/images/course-defense.jpg",
    color: "bg-slate-700",
    tags: ["Protection", "Inflation", "Taxes", "Economic Defense"],
    certificateId: "cert-defense",
  },
  "family-learning": {
    id: "family-learning",
    title: "Family Financial Learning",
    subtitle: "Build a financially literate family from the ground up.",
    description: "Financial success is a family system. This course teaches parents and children how to discuss money, build shared financial goals, create family budgets, and set generational wealth plans.",
    category: "Family Learning",
    difficulty: "Beginner",
    instructor: "edunancial-team",
    lessons: ["ff-01", "ff-02", "ff-03", "ff-04"],
    quizzes: ["quiz-financial-foundations"],
    totalDuration: "1h 20min",
    enrolledCount: 2100,
    rating: 4.7,
    reviewCount: 156,
    thumbnail: "/images/course-family.jpg",
    color: "bg-green-700",
    tags: ["Family", "Children", "Generational Wealth", "Budgeting"],
    certificateId: "cert-family",
  },
  "teen-entrepreneurs": {
    id: "teen-entrepreneurs",
    title: "Teen Entrepreneurs",
    subtitle: "Start your first business before you graduate.",
    description: "Built specifically for teens 13–19, this course covers idea validation, product creation, digital marketing, and selling your first product or service. The best time to start is now.",
    category: "Teen Entrepreneurs",
    difficulty: "Beginner",
    instructor: "edunancial-team",
    lessons: ["blue-01", "blue-02", "blue-03"],
    quizzes: ["quiz-business-intro"],
    totalDuration: "59 min",
    enrolledCount: 1840,
    rating: 4.9,
    reviewCount: 204,
    thumbnail: "/images/course-teen.jpg",
    color: "bg-purple-700",
    tags: ["Teens", "Youth", "Entrepreneurship", "First Business"],
    certificateId: "cert-teen",
    isFree: true,
  },
  "executive-learning": {
    id: "executive-learning",
    title: "Executive Learning Track",
    subtitle: "Advanced financial and business strategy for leaders and executives.",
    description: "The Executive Track covers advanced topics: capital allocation, mergers and acquisitions, equity compensation, C-suite financial dashboards, and wealth preservation strategies for high-income earners.",
    category: "Executive Learning",
    difficulty: "Advanced",
    instructor: "edunancial-team",
    lessons: ["white-05", "white-07", "blue-06", "blue-07"],
    quizzes: ["quiz-business-intro", "quiz-paper-assets-intro"],
    totalDuration: "1h 38min",
    enrolledCount: 890,
    rating: 4.8,
    reviewCount: 98,
    thumbnail: "/images/course-executive.jpg",
    color: "bg-amber-800",
    tags: ["Executive", "Advanced", "Capital", "Leadership", "Wealth Preservation"],
    certificateId: "cert-executive",
  },
};

// Flat array for iteration
export const courseList = Object.values(courses);
export const lessonList = Object.values(lessons);
export const quizList = Object.values(quizzes);
export const instructorList = Object.values(instructors);

export const categories: CourseCategory[] = [
  "Real Estate",
  "Paper Assets",
  "Business",
  "Financial Foundations",
  "Economic Self Defense",
  "Family Learning",
  "Teen Entrepreneurs",
  "Executive Learning",
];

export const categoryColors: Record<CourseCategory, string> = {
  "Real Estate": "bg-red-700",
  "Paper Assets": "bg-slate-200 text-slate-900",
  "Business": "bg-blue-700",
  "Financial Foundations": "bg-yellow-600",
  "Economic Self Defense": "bg-slate-600",
  "Family Learning": "bg-green-700",
  "Teen Entrepreneurs": "bg-purple-700",
  "Executive Learning": "bg-amber-800",
};
