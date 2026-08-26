export type CredentialStage = "FOUNDATION" | "COMPETENCY" | "APPLIED" | "BUSINESS_READINESS";

export type ReadinessDomain = {
  id: string;
  name: string;
  description: string;
  evidenceExamples: string[];
};

export const credentialStages: Array<{
  stage: CredentialStage;
  label: string;
  purpose: string;
}> = [
  {
    stage: "FOUNDATION",
    label: "Foundation Completion",
    purpose: "Recognizes verified completion of a defined Edunancial learning sequence.",
  },
  {
    stage: "COMPETENCY",
    label: "Demonstrated Competency",
    purpose: "Requires assessment evidence showing the learner can apply core concepts.",
  },
  {
    stage: "APPLIED",
    label: "Applied Practice",
    purpose: "Requires projects, scenarios, analyses, or other work products demonstrating practical judgment.",
  },
  {
    stage: "BUSINESS_READINESS",
    label: "Entrepreneur Business Readiness",
    purpose: "Integrates cross-disciplinary evidence useful to mentors, employers, lenders, incubators, accelerators, investors, and other opportunity partners.",
  },
];

export const businessReadinessDomains: ReadinessDomain[] = [
  {
    id: "financial-literacy",
    name: "Financial Intelligence",
    description: "Understands cash flow, financial statements, unit economics, capital needs, and financial decision-making.",
    evidenceExamples: ["cash-flow analysis", "financial statement interpretation", "unit-economics exercise"],
  },
  {
    id: "business-model",
    name: "Business Model & Strategy",
    description: "Can explain the customer, value proposition, revenue model, operating model, and major business risks.",
    evidenceExamples: ["business model", "market analysis", "competitive positioning"],
  },
  {
    id: "tax",
    name: "Tax Awareness",
    description: "Recognizes core business-tax obligations, entity-tax tradeoffs, recordkeeping needs, and when professional advice is required.",
    evidenceExamples: ["tax scenario assessment", "entity-tax comparison", "compliance checklist"],
  },
  {
    id: "legal",
    name: "Legal & Risk Fundamentals",
    description: "Understands contracts, entity structure, liability, intellectual property, employment classification, and common legal risks.",
    evidenceExamples: ["contract-risk review", "entity selection exercise", "legal issue spotting"],
  },
  {
    id: "sales-marketing",
    name: "Sales & Customer Acquisition",
    description: "Can define target customers, articulate an offer, estimate acquisition economics, and build a practical sales approach.",
    evidenceExamples: ["sales plan", "customer acquisition model", "offer design"],
  },
  {
    id: "operations",
    name: "Operations & Execution",
    description: "Can translate a business concept into repeatable operating steps, quality controls, staffing needs, and performance measures.",
    evidenceExamples: ["operating plan", "process map", "KPI set"],
  },
  {
    id: "leadership",
    name: "Leadership & Management",
    description: "Demonstrates planning, delegation, accountability, communication, and ethical decision-making appropriate to business ownership.",
    evidenceExamples: ["leadership scenario", "team plan", "decision memo"],
  },
  {
    id: "capital-readiness",
    name: "Capital Readiness",
    description: "Can explain use of funds, financing needs, repayment or return logic, major assumptions, and material risks to a capital provider.",
    evidenceExamples: ["use-of-funds schedule", "funding request", "investor or lender readiness review"],
  },
];
