// src/data/security/us.security.ts

export type SecurityPolicyItem = {
  title: string;
  summary: string;
};

export type SecurityPolicy = {
  region: "us";
  lastUpdatedISO: string;
  items: SecurityPolicyItem[];
};

export const US_SECURITY: SecurityPolicy = {
  region: "us",
  lastUpdatedISO: new Date().toISOString(),
  items: [
    {
      title: "Data Minimization",
      summary:
        "Only essential data is collected to operate and improve the platform.",
    },
    {
      title: "Access Control",
      summary:
        "Admin and privileged routes are protected via role-based checks.",
    },
    {
      title: "Transport Security",
      summary:
        "All traffic is encrypted in transit using HTTPS.",
    },
    {
      title: "Operational Integrity",
      summary:
        "Critical actions are traceable to support audits and monitoring.",
    },
  ],
};
