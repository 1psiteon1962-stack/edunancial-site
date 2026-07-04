export interface ComplianceItem {

  title: string;

  jurisdiction: string;

  status:
    | "pending"
    | "review"
    | "complete";

}

export function getComplianceItems(): ComplianceItem[] {

  return [

    {

      title: "Privacy Policy",

      jurisdiction: "United States",

      status: "complete",

    },

    {

      title: "Terms of Service",

      jurisdiction: "Global",

      status: "review",

    },

    {

      title: "Marketplace Agreements",

      jurisdiction: "Global",

      status: "pending",

    },

  ];

}
