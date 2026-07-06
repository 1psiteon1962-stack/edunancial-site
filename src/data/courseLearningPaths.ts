export interface LearningModule {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
}

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  competencyAward: string;
  color: "red" | "white" | "blue" | "gold";
  modules: LearningModule[];
}

export const learningPaths: LearningPath[] = [
  {
    id: "foundations",
    title: "Foundations",
    subtitle: "Start Here",
    description:
      "Build the mindset required to think financially before making financial decisions.",
    difficulty: "Beginner",
    estimatedHours: 8,
    competencyAward: "Foundations",
    color: "gold",
    modules: [
      {
        id: "purpose",
        title: "Why Financial Competency Matters",
        description: "Financial literacy versus financial competency.",
        estimatedHours: 1
      },
      {
        id: "thinking",
        title: "How Entrepreneurs Think",
        description: "Decision making before action.",
        estimatedHours: 2
      },
      {
        id: "numbers",
        title: "Know Your Numbers",
        description: "The language of business.",
        estimatedHours: 2
      },
      {
        id: "discipline",
        title: "Discipline Before Wealth",
        description: "Habits create financial outcomes.",
        estimatedHours: 3
      }
    ]
  },

  {
    id: "financial-literacy",
    title: "Financial Literacy",
    subtitle: "Understand Money",
    description:
      "Learn the principles of saving, investing, budgeting and credit.",
    difficulty: "Beginner",
    estimatedHours: 25,
    competencyAward: "Financial Literacy",
    color: "white",
    modules: []
  },

  {
    id: "financial-competency",
    title: "Financial Competency",
    subtitle: "Apply Knowledge",
    description:
      "Move from understanding concepts to making consistently better decisions.",
    difficulty: "Intermediate",
    estimatedHours: 35,
    competencyAward: "Financial Competency",
    color: "white",
    modules: []
  },

  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    subtitle: "Build Businesses",
    description:
      "Start with problems. Validate assumptions. Build profitable solutions.",
    difficulty: "Intermediate",
    estimatedHours: 40,
    competencyAward: "Startup Foundations",
    color: "blue",
    modules: []
  },

  {
    id: "operations",
    title: "Business Operations",
    subtitle: "Operate Efficiently",
    description:
      "Systems, pricing, KPIs, hiring and cash flow.",
    difficulty: "Intermediate",
    estimatedHours: 45,
    competencyAward: "Business Operations",
    color: "blue",
    modules: []
  },

  {
    id: "scaling",
    title: "Business Scaling",
    subtitle: "Grow Responsibly",
    description:
      "Scale using measurable evidence instead of assumptions.",
    difficulty: "Advanced",
    estimatedHours: 50,
    competencyAward: "Business Scaling",
    color: "blue",
    modules: []
  },

  {
    id: "executive",
    title: "Executive Leadership",
    subtitle: "Lead Organizations",
    description:
      "Leadership, capital allocation and strategic thinking.",
    difficulty: "Advanced",
    estimatedHours: 60,
    competencyAward: "Executive Leadership",
    color: "gold",
    modules: []
  },

  {
    id: "ai-business",
    title: "AI for Business",
    subtitle: "Executive AI",
    description:
      "Use AI to improve decisions—not replace judgment.",
    difficulty: "Intermediate",
    estimatedHours: 30,
    competencyAward: "AI for Entrepreneurs",
    color: "gold",
    modules: []
  },

  {
    id: "international",
    title: "International Business Competency",
    subtitle: "Operate Globally",
    description:
      "Treasury management, currencies, banking, taxation and international expansion.",
    difficulty: "Advanced",
    estimatedHours: 55,
    competencyAward: "Global Business",
    color: "gold",
    modules: []
  },

  {
    id: "wealth",
    title: "Wealth Building",
    subtitle: "Long-Term Independence",
    description:
      "Integrate real estate, paper assets and businesses into one wealth strategy.",
    difficulty: "Advanced",
    estimatedHours: 70,
    competencyAward: "Wealth Builder",
    color: "red",
    modules: []
  }
];
