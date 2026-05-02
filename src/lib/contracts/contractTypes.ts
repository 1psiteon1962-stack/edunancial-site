// src/lib/contracts/contractTypes.ts

export type ContractTemplateKey =
  | "termsOfUse"
  | "privacyPolicy"
  | "subscriptionAgreement"
  | "revenueShareAgreement"
  | "generalServiceAgreement";

export type ContractTemplate = {
  key: ContractTemplateKey;
  title: string;
  version: string;
  effectiveDate: string;
  body: string;
};

export const CONTRACT_TEMPLATES: Record<ContractTemplateKey, ContractTemplate> = {
  termsOfUse: {
    key: "termsOfUse",
    title: "Terms of Use",
    version: "1.0.0",
    effectiveDate: "2026-05-02",
    body: "These Terms of Use govern access to and use of the Edunancial platform.",
  },

  privacyPolicy: {
    key: "privacyPolicy",
    title: "Privacy Policy",
    version: "1.0.0",
    effectiveDate: "2026-05-02",
    body: "This Privacy Policy describes how Edunancial collects, uses, stores, and protects information.",
  },

  subscriptionAgreement: {
    key: "subscriptionAgreement",
    title: "Subscription Agreement",
    version: "1.0.0",
    effectiveDate: "2026-05-02",
    body: "This Subscription Agreement governs paid access to Edunancial products and services.",
  },

  revenueShareAgreement: {
    key: "revenueShareAgreement",
    title: "Revenue Share Agreement",
    version: "1.0.0",
    effectiveDate: "2026-05-02",
    body: "This Revenue Share Agreement outlines participation, revenue allocation, and payment terms.",
  },

  generalServiceAgreement: {
    key: "generalServiceAgreement",
    title: "General Service Agreement",
    version: "1.0.0",
    effectiveDate: "2026-05-02",
    body: "This General Service Agreement governs general services provided through the Edunancial platform.",
  },
};
