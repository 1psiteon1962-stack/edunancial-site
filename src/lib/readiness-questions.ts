export interface ReadinessOption {
  label: string;
  value: string;
  weight: number;
}

export interface ReadinessQuestion {
  id: string;
  prompt: string;
  options: ReadinessOption[];
}

/**
 * USED BY components/EduReadiness.tsx
 * Import path MUST be "@/lib/readiness-questions"
 */
export const readinessQuestions: ReadinessQuestion[] = [
  {
    id: "structure",
    prompt: "Do you have a formal business or legal structure in place?",
    options: [
      { label: "No structure", value: "none", weight: 0 },
      { label: "Informal / DBA", value: "informal", weight: 10 },
      { label: "LLC or Corp", value: "formal", weight: 20 },
      { label: "Multi-entity / holding structure", value: "advanced", weight: 30 }
    ]
  },
  {
    id: "records",
    prompt: "How well are your financial records maintained?",
    options: [
      { label: "No records", value: "none", weight: 0 },
      { label: "Basic tracking", value: "basic", weight: 10 },
      { label: "Bookkeeping software", value: "software", weight: 20 },
      { label: "CPA-reviewed / audited", value: "audited", weight: 30 }
    ]
  },
  {
    id: "revenue",
    prompt: "Is your revenue predictable and recurring?",
    options: [
      { label: "No revenue", value: "none", weight: 0 },
      { label: "Inconsistent", value: "inconsistent", weight: 10 },
      { label: "Some recurring", value: "recurring", weight: 20 },
      { label: "Highly predictable", value: "predictable", weight: 30 }
    ]
  },
  {
    id: "compliance",
    prompt: "Are you compliant with tax and regulatory obligations?",
    options: [
      { label: "Not compliant", value: "none", weight: 0 },
      { label: "Partially compliant", value: "partial", weight: 10 },
      { label: "Fully compliant", value: "full", weight: 20 },
      { label: "Proactively managed", value: "proactive", weight: 30 }
    ]
  },
  {
    id: "scaling",
    prompt: "Can your operation scale without breaking?",
    options: [
      { label: "No systems", value: "none", weight: 0 },
      { label: "Some processes", value: "some", weight: 10 },
      { label: "Documented systems", value: "documented", weight: 20 },
      { label: "Automated & delegated", value: "automated", weight: 30 }
    ]
  }
];
