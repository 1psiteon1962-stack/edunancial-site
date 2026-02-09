// src/app/security/us-security.ts

export interface SecurityItem {
  id: string;
  title: string;
  description: string;
}

export interface SecurityRegion {
  region: string;
  lastUpdated: string;
  items: SecurityItem[];
}

export const US_SECURITY: SecurityRegion = {
  region: "us",
  lastUpdated: "2024-12-18T22:14:00Z",
  items: [
    {
      id: "data-protection",
      title: "Data Protection",
      description:
        "All user data is encrypted at rest and in transit using industry-standard encryption."
    },
    {
      id: "access-control",
      title: "Access Control",
      description:
        "Strict role-based access controls are enforced across all internal systems."
    },
    {
      id: "monitoring",
      title: "Monitoring & Auditing",
      description:
        "Continuous monitoring and audit logging are enabled to detect and respond to threats."
    }
  ]
};
