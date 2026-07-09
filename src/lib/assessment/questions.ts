import { CompetencyArea } from "./scoring";

export interface AnswerOption {
  label: "A" | "B" | "C" | "D";
  text: string;
}

export interface AssessmentQuestion {
  id: string;
  area: CompetencyArea;
  text: string;
  options: AnswerOption[];
}

export interface SectionDefinition {
  number: number;
  area: CompetencyArea;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  nextPath: string;
  questions: AssessmentQuestion[];
}

export const SECTIONS: SectionDefinition[] = [
  {
    number: 1,
    area: "personalFinance",
    title: "Personal Financial Management",
    subtitle: "SECTION 1 OF 6",
    description:
      "This section measures your understanding of budgeting, cash flow, debt management, savings, emergency planning, and financial decision making.",
    accentColor: "text-yellow-400",
    nextPath: "/assessment/start/section-2",
    questions: [
      {
        id: "pf-1",
        area: "personalFinance",
        text: "How often do you prepare and follow a written budget?",
        options: [
          { label: "A", text: "Every month" },
          { label: "B", text: "Most months" },
          { label: "C", text: "Occasionally" },
          { label: "D", text: "Never" },
        ],
      },
      {
        id: "pf-2",
        area: "personalFinance",
        text: "If you lost your primary source of income today, how long could you pay your normal living expenses?",
        options: [
          { label: "A", text: "More than one year" },
          { label: "B", text: "Six to twelve months" },
          { label: "C", text: "One to six months" },
          { label: "D", text: "Less than one month" },
        ],
      },
      {
        id: "pf-3",
        area: "personalFinance",
        text: "Which statement best describes your savings habits?",
        options: [
          { label: "A", text: "I save automatically every payday." },
          { label: "B", text: "I save regularly but not consistently." },
          { label: "C", text: "I save only when money is left over." },
          { label: "D", text: "I rarely save money." },
        ],
      },
      {
        id: "pf-4",
        area: "personalFinance",
        text: "When making a purchase, what usually influences your decision the most?",
        options: [
          { label: "A", text: "My written financial plan and budget." },
          { label: "B", text: "I compare value before buying." },
          { label: "C", text: "I usually decide based on emotion." },
          { label: "D", text: "I buy what I want without much planning." },
        ],
      },
    ],
  },
  {
    number: 2,
    area: "investing",
    title: "Investing & Paper Assets",
    subtitle: "SECTION 2 OF 6",
    description:
      "This section evaluates your understanding of investing, diversification, stocks, ETFs, retirement planning, precious metals, and long-term wealth creation.",
    accentColor: "text-white",
    nextPath: "/assessment/start/section-3",
    questions: [
      {
        id: "inv-1",
        area: "investing",
        text: "Which statement best describes your current investing experience?",
        options: [
          { label: "A", text: "I actively manage multiple investments." },
          { label: "B", text: "I invest regularly." },
          { label: "C", text: "I have invested a little." },
          { label: "D", text: "I have never invested." },
        ],
      },
      {
        id: "inv-2",
        area: "investing",
        text: "How diversified is your investment portfolio?",
        options: [
          { label: "A", text: "Highly diversified across multiple asset classes" },
          { label: "B", text: "Moderately diversified" },
          { label: "C", text: "Limited diversification" },
          { label: "D", text: "No investments" },
        ],
      },
      {
        id: "inv-3",
        area: "investing",
        text: "Which investment best protects purchasing power over the long term?",
        options: [
          { label: "A", text: "Diversified portfolio of productive assets" },
          { label: "B", text: "Savings account only" },
          { label: "C", text: "Cash kept at home" },
          { label: "D", text: "I don't know" },
        ],
      },
      {
        id: "inv-4",
        area: "investing",
        text: "Before purchasing an investment, how much research do you typically conduct?",
        options: [
          { label: "A", text: "Extensive research and comparison" },
          { label: "B", text: "Some research" },
          { label: "C", text: "Very little research" },
          { label: "D", text: "I usually rely on tips or emotion" },
        ],
      },
    ],
  },
  {
    number: 3,
    area: "realEstate",
    title: "Real Estate Competency",
    subtitle: "SECTION 3 OF 6",
    description:
      "This section evaluates your understanding of real estate, financing methods, investment strategies, and wealth-building through property.",
    accentColor: "text-red-500",
    nextPath: "/assessment/start/section-4",
    questions: [
      {
        id: "re-1",
        area: "realEstate",
        text: "Have you ever purchased real estate?",
        options: [
          { label: "A", text: "Multiple investment properties" },
          { label: "B", text: "My primary residence only" },
          { label: "C", text: "Currently researching" },
          { label: "D", text: "Never purchased property" },
        ],
      },
      {
        id: "re-2",
        area: "realEstate",
        text: "Which financing methods are you familiar with?",
        options: [
          { label: "A", text: "Conventional, FHA, VA, and creative financing" },
          { label: "B", text: "Conventional mortgages only" },
          { label: "C", text: "Very limited knowledge" },
          { label: "D", text: "No experience" },
        ],
      },
      {
        id: "re-3",
        area: "realEstate",
        text: "What is the primary reason people invest in real estate?",
        options: [
          { label: "A", text: "Cash flow, appreciation, tax advantages, and leverage" },
          { label: "B", text: "Appreciation only" },
          { label: "C", text: "Because property values always increase" },
          { label: "D", text: "I don't know" },
        ],
      },
      {
        id: "re-4",
        area: "realEstate",
        text: "Which statement best describes your current real estate activity?",
        options: [
          { label: "A", text: "Actively acquiring investment properties" },
          { label: "B", text: "Planning to purchase within two years" },
          { label: "C", text: "Interested but uncertain where to begin" },
          { label: "D", text: "No current plans" },
        ],
      },
    ],
  },
  {
    number: 4,
    area: "business",
    title: "Business Competency",
    subtitle: "SECTION 4 OF 6",
    description:
      "This section measures your understanding of entrepreneurship, profitability, KPIs, leadership, and business strategy.",
    accentColor: "text-blue-500",
    nextPath: "/assessment/start/section-5",
    questions: [
      {
        id: "biz-1",
        area: "business",
        text: "Which statement best describes your current business experience?",
        options: [
          { label: "A", text: "I currently own one or more businesses." },
          { label: "B", text: "I previously owned a business." },
          { label: "C", text: "I plan to start a business." },
          { label: "D", text: "I have never owned a business." },
        ],
      },
      {
        id: "biz-2",
        area: "business",
        text: "Which financial measurement is most important in a profitable business?",
        options: [
          { label: "A", text: "Profit" },
          { label: "B", text: "Revenue" },
          { label: "C", text: "Number of employees" },
          { label: "D", text: "Size of the office" },
        ],
      },
      {
        id: "biz-3",
        area: "business",
        text: "How frequently do you review Key Performance Indicators (KPIs)?",
        options: [
          { label: "A", text: "Weekly or more often" },
          { label: "B", text: "Monthly" },
          { label: "C", text: "Occasionally" },
          { label: "D", text: "I do not track KPIs" },
        ],
      },
      {
        id: "biz-4",
        area: "business",
        text: "Which statement best reflects your philosophy about business?",
        options: [
          { label: "A", text: "A business exists to consistently generate profits." },
          { label: "B", text: "Revenue growth is more important than profitability." },
          { label: "C", text: "I have not yet developed a business philosophy." },
          { label: "D", text: "I am unsure." },
        ],
      },
    ],
  },
  {
    number: 5,
    area: "riskManagement",
    title: "Risk Management",
    subtitle: "SECTION 5 OF 6",
    description:
      "Wealth is not created simply by making money. This section measures your ability to protect and preserve what you build.",
    accentColor: "text-green-400",
    nextPath: "/assessment/start/section-6",
    questions: [
      {
        id: "risk-1",
        area: "riskManagement",
        text: "Do you currently maintain an emergency fund?",
        options: [
          { label: "A", text: "More than twelve months of expenses" },
          { label: "B", text: "Six to twelve months" },
          { label: "C", text: "Less than six months" },
          { label: "D", text: "No emergency fund" },
        ],
      },
      {
        id: "risk-2",
        area: "riskManagement",
        text: "How would you describe your understanding of insurance and asset protection?",
        options: [
          { label: "A", text: "Very knowledgeable — I have comprehensive coverage" },
          { label: "B", text: "Moderate understanding" },
          { label: "C", text: "Limited understanding" },
          { label: "D", text: "Very little knowledge" },
        ],
      },
      {
        id: "risk-3",
        area: "riskManagement",
        text: "How diversified are your financial assets?",
        options: [
          { label: "A", text: "Diversified across multiple asset classes" },
          { label: "B", text: "Some diversification" },
          { label: "C", text: "Very limited diversification" },
          { label: "D", text: "No investment diversification" },
        ],
      },
      {
        id: "risk-4",
        area: "riskManagement",
        text: "Before making a major financial decision, what do you typically do?",
        options: [
          { label: "A", text: "Research thoroughly and evaluate alternatives" },
          { label: "B", text: "Seek advice from knowledgeable professionals" },
          { label: "C", text: "Make decisions primarily on instinct" },
          { label: "D", text: "Often make quick decisions without much planning" },
        ],
      },
    ],
  },
  {
    number: 6,
    area: "financialProfile",
    title: "Financial Competency Profile",
    subtitle: "SECTION 6 OF 6",
    description:
      "This final section helps us understand your financial goals, motivation, learning preferences, and long-term objectives.",
    accentColor: "text-yellow-400",
    nextPath: "/assessment/results",
    questions: [
      {
        id: "fp-1",
        area: "financialProfile",
        text: "What is your primary financial goal over the next five years?",
        options: [
          { label: "A", text: "Financial Independence" },
          { label: "B", text: "Build a successful business" },
          { label: "C", text: "Become an active investor" },
          { label: "D", text: "Improve my financial knowledge" },
        ],
      },
      {
        id: "fp-2",
        area: "financialProfile",
        text: "Which statement best describes you today?",
        options: [
          { label: "A", text: "I actively build wealth every month." },
          { label: "B", text: "I'm making progress but need better structure." },
          { label: "C", text: "I'm just getting started." },
          { label: "D", text: "I don't currently have a financial plan." },
        ],
      },
      {
        id: "fp-3",
        area: "financialProfile",
        text: "How do you learn new financial concepts most effectively?",
        options: [
          { label: "A", text: "Reading books and articles" },
          { label: "B", text: "Watching videos and demonstrations" },
          { label: "C", text: "Hands-on practice and real-world application" },
          { label: "D", text: "One-on-one coaching or mentoring" },
        ],
      },
      {
        id: "fp-4",
        area: "financialProfile",
        text: "If you could master one financial skill next, what would it be?",
        options: [
          { label: "A", text: "Building profitable businesses" },
          { label: "B", text: "Real estate investing" },
          { label: "C", text: "Investing in stocks, ETFs, and precious metals" },
          { label: "D", text: "Personal financial planning and budgeting" },
        ],
      },
    ],
  },
];

export function getSectionByNumber(n: number): SectionDefinition | undefined {
  return SECTIONS.find((s) => s.number === n);
}

export const TOTAL_QUESTIONS = SECTIONS.reduce(
  (sum, s) => sum + s.questions.length,
  0
);
