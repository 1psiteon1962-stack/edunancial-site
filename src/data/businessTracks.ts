export type BusinessStage =
  | "startup"
  | "growth"
  | "scale";

export type BusinessProblem =
  | "cashFlow"
  | "sales"
  | "marketing"
  | "pricing"
  | "profit"
  | "hiring"
  | "leadership"
  | "operations"
  | "systems"
  | "financing"
  | "legal"
  | "taxes";

export interface BusinessTrack {
  id: BusinessStage;
  title: string;
  years: string;
  description: string;
  objectives: string[];
  recommendedCourses: string[];
}

export const businessTracks: BusinessTrack[] = [
  {
    id: "startup",
    title: "Startup",
    years: "0-3 Years",
    description:
      "Build a profitable business before focusing on expansion.",
    objectives: [
      "Find product-market fit",
      "Generate consistent revenue",
      "Understand KPIs",
      "Price for profit",
      "Create repeatable sales",
      "Develop financial discipline"
    ],
    recommendedCourses: [
      "Know Your Numbers",
      "Profit First",
      "Cash Flow Basics",
      "Sales Fundamentals",
      "Pricing Strategy",
      "Business Foundations"
    ]
  },

  {
    id: "growth",
    title: "Growth",
    years: "4-7 Years",
    description:
      "Build systems and management to support expansion.",
    objectives: [
      "Hire correctly",
      "Delegate effectively",
      "Improve margins",
      "Develop management",
      "Increase operational efficiency",
      "Scale profitably"
    ],
    recommendedCourses: [
      "Hiring & Leadership",
      "Operational Systems",
      "Financial Forecasting",
      "Marketing ROI",
      "Management Fundamentals",
      "Scaling a Business"
    ]
  },

  {
    id: "scale",
    title: "Scale",
    years: "8+ Years",
    description:
      "Create an enterprise capable of operating without the owner.",
    objectives: [
      "Executive leadership",
      "Corporate governance",
      "Expansion planning",
      "International growth",
      "Acquisitions",
      "Long-term wealth creation"
    ],
    recommendedCourses: [
      "Executive Finance",
      "Scaling Operations",
      "Acquisitions",
      "Corporate Structure",
      "Global Expansion",
      "Family Office Planning"
    ]
  }
];

export const businessChallenges = [
  {
    id: "cashFlow",
    label: "Cash Flow"
  },
  {
    id: "sales",
    label: "Sales"
  },
  {
    id: "marketing",
    label: "Marketing"
  },
  {
    id: "pricing",
    label: "Pricing"
  },
  {
    id: "profit",
    label: "Profit"
  },
  {
    id: "hiring",
    label: "Hiring"
  },
  {
    id: "leadership",
    label: "Leadership"
  },
  {
    id: "operations",
    label: "Operations"
  },
  {
    id: "systems",
    label: "Systems"
  },
  {
    id: "financing",
    label: "Financing"
  },
  {
    id: "legal",
    label: "Legal"
  },
  {
    id: "taxes",
    label: "Taxes"
  }
];
