// lib/content-registry.ts

export type ContentSection = {
  id: string;
  title: string;
  description: string;
  body?: string;
};

export type ContentRegistry = {
  title: string;
  subtitle?: string;
  sections: ContentSection[];
};

export const contentRegistry: ContentRegistry = {
  title: "Financial Literacy, Structured for Real Life",
  subtitle:
    "Understand where you are, what comes next, and how to move forward with confidence.",
  sections: [
    {
      id: "foundation",
      title: "Foundation",
      description:
        "Learn the fundamentals of money, business structures, and personal financial control."
    },
    {
      id: "growth",
      title: "Growth",
      description:
        "Apply practical tools to grow income, protect assets, and make informed decisions."
    },
    {
      id: "advancement",
      title: "Advancement",
      description:
        "Access advanced models, analytics, and strategies used by experienced operators."
    }
  ]
};
