export interface PublicRelationsActivity {

  organization: string;

  opportunity: string;

  priority:
    | "low"
    | "medium"
    | "high";

}

export function getPROpportunities(): PublicRelationsActivity[] {

  return [

    {

      organization: "Podcast",

      opportunity: "Interview",

      priority: "medium",

    },

    {

      organization: "University",

      opportunity: "Speaking",

      priority: "high",

    },

    {

      organization: "Business Conference",

      opportunity: "Keynote",

      priority: "medium",

    },

  ];

}
