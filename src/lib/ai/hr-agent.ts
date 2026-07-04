export interface HiringRecommendation {

  country: string;

  position: string;

  estimatedMonthlyCost: number;

  language: string;

  timeZone: string;

  recommendation: string;

}

export function getHiringRecommendations(): HiringRecommendation[] {

  return [

    {

      country: "Uganda",

      position: "Virtual Assistant",

      estimatedMonthlyCost: 0,

      language: "English",

      timeZone: "EAT",

      recommendation:
        "Research Candidate Pool",

    },

    {

      country: "Nigeria",

      position: "Customer Support",

      estimatedMonthlyCost: 0,

      language: "English",

      timeZone: "WAT",

      recommendation:
        "Research Candidate Pool",

    },

    {

      country: "Dominican Republic",

      position: "Spanish Support",

      estimatedMonthlyCost: 0,

      language: "Spanish",

      timeZone: "AST",

      recommendation:
        "Research Candidate Pool",

    },

  ];

}
