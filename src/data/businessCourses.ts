export interface BusinessCourse {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  prerequisite: string | null;
  description: string;
}

export const businessCourses: BusinessCourse[] = [
  {
    id: "know-your-numbers",
    title: "Know Your Numbers",
    category: "Financial",
    difficulty: "Beginner",
    estimatedHours: 4,
    prerequisite: null,
    description:
      "Learn the financial metrics and KPIs every business owner must understand before making decisions."
  },

  {
    id: "cash-flow",
    title: "Cash Flow Management",
    category: "Financial",
    difficulty: "Beginner",
    estimatedHours: 5,
    prerequisite: "know-your-numbers",
    description:
      "Understand, monitor and improve the movement of cash through your business."
  },

  {
    id: "profit-first",
    title: "Profit Before Growth",
    category: "Financial",
    difficulty: "Intermediate",
    estimatedHours: 6,
    prerequisite: "cash-flow",
    description:
      "Build a profitable company before pursuing aggressive expansion."
  },

  {
    id: "pricing",
    title: "Pricing Strategy",
    category: "Sales",
    difficulty: "Intermediate",
    estimatedHours: 4,
    prerequisite: "know-your-numbers",
    description:
      "Develop pricing models that maximize profit while remaining competitive."
  },

  {
    id: "sales",
    title: "Sales Systems",
    category: "Sales",
    difficulty: "Intermediate",
    estimatedHours: 8,
    prerequisite: "pricing",
    description:
      "Create predictable, repeatable sales processes that consistently generate revenue."
  },

  {
    id: "marketing",
    title: "Marketing ROI",
    category: "Marketing",
    difficulty: "Intermediate",
    estimatedHours: 6,
    prerequisite: "sales",
    description:
      "Measure marketing success by profitability and return on investment."
  },

  {
    id: "leadership",
    title: "Leadership",
    category: "Management",
    difficulty: "Advanced",
    estimatedHours: 8,
    prerequisite: "profit-first",
    description:
      "Lead people effectively while building a culture of accountability and performance."
  },

  {
    id: "hiring",
    title: "Hiring Great Employees",
    category: "Management",
    difficulty: "Advanced",
    estimatedHours: 6,
    prerequisite: "leadership",
    description:
      "Recruit, train and retain employees who strengthen your organization."
  },

  {
    id: "systems",
    title: "Business Systems",
    category: "Operations",
    difficulty: "Advanced",
    estimatedHours: 10,
    prerequisite: "leadership",
    description:
      "Create documented systems and processes that allow the business to scale."
  },

  {
    id: "scale",
    title: "Scaling A Business",
    category: "Growth",
    difficulty: "Advanced",
    estimatedHours: 12,
    prerequisite: "systems",
    description:
      "Expand a profitable business through leadership, systems, automation, and disciplined execution."
  }
];
