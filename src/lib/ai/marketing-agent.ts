export interface MarketingCampaign {

  id: string;

  title: string;

  audience: string;

  platform: string;

  status:
    | "planned"
    | "active"
    | "completed";

}

export function getMarketingCampaigns(): MarketingCampaign[] {

  return [

    {
      id: "linkedin",

      title: "LinkedIn Daily Thought Leadership",

      audience: "Global Entrepreneurs",

      platform: "LinkedIn",

      status: "active",
    },

    {
      id: "youtube",

      title: "Financial Competency Videos",

      audience: "Worldwide",

      platform: "YouTube",

      status: "planned",
    },

    {
      id: "email",

      title: "Membership Email Funnel",

      audience: "Members",

      platform: "Email",

      status: "planned",
    },

  ];

}
