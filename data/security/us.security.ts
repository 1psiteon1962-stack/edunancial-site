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
        "We only collect what is necessary to provide the service and improve reliability.",
    },
    {
      title: "Access Control",
      summary:
        "Restricted access to admin-only functions; role checks are enforced server-side where applicable.",
    },
    {
      title: "Encryption",
      summary:
        "Transport security (HTTPS) is required; sensitive tokens should be stored securely.",
    },
    {
      title: "Auditability",
      summary:
        "Key events can be logged for review; security-relevant actions should be traceable.",
    },
  ],
};
