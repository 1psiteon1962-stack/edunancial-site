export interface ResearchOpportunity {

  country: string;

  category: string;

  opportunity: string;

  priority:
    | "low"
    | "medium"
    | "high";

}

export function getResearchOpportunities(): ResearchOpportunity[] {

  return [

    {

      country: "United States",

      category: "Marketplace",

      opportunity: "Expand licensed professionals.",

      priority: "high",

    },

    {

      country: "Canada",

      category: "Localization",

      opportunity: "Provincial marketplace research.",

      priority: "medium",

    },

    {

      country: "Nigeria",

      category: "Expansion",

      opportunity: "Payment providers and partnerships.",

      priority: "high",

    },

    {

      country: "Uganda",

      category: "Education",

      opportunity: "Financial literacy partnerships.",

      priority: "high",

    },

  ];

}
