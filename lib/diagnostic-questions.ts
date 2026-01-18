/**
 * Proprietary diagnostic questions
 * Internal use only – not public-facing IP
 */

export type DiagnosticAnswer = 0 | 1 | 2 | 3 | 4;

export interface DiagnosticQuestion {
  id: string;
  prompt: string;
  weight: number;
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "entity_structure",
    prompt: "Do you have a formally registered business entity?",
    weight: 1,
  },
  {
    id: "revenue_predictability",
    prompt: "Is your revenue predictable month to month?",
    weight: 2,
  },
  {
    id: "delegation",
    prompt: "Can your business operate without you for 30 days?",
    weight: 3,
  },
  {
    id: "kpi_tracking",
    prompt: "Do you track KPIs beyond basic revenue?",
    weight: 4,
  },
  {
    id: "capital_readiness",
    prompt: "Could your business pass investor due diligence today?",
    weight: 5,
  },
];
