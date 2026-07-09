// ─── Educational Guardrails ───────────────────────────────────────────────────
// Ensures the AI Tutor encourages education rather than personalized advice.

import type { GuardrailCategory } from "./types";

interface GuardrailResult {
  category: GuardrailCategory;
  requiresEscalation: boolean;
  escalationReason?: string;
  disclaimerText?: string;
}

// Patterns that indicate requests for advice outside educational scope
const LEGAL_PATTERNS = [
  /\b(sue|lawsuit|legal action|attorney|lawyer|litigation|court)\b/i,
  /\b(legal advice|is this legal|illegal)\b/i,
];

const TAX_PATTERNS = [
  /\b(tax advice|file my taxes|tax return|irs|cra|deduct|write.?off)\b/i,
  /\b(how much tax|my tax|taxes owed|tax liability)\b/i,
];

const INVESTMENT_ADVICE_PATTERNS = [
  /\b(should i (buy|sell|invest in)|buy this stock|which stock|pick for me)\b/i,
  /\b(guaranteed return|sure thing|can't lose|best investment for me)\b/i,
];

const PERSONALIZED_ADVICE_PATTERNS = [
  /\b(my portfolio|my investments|my specific situation|advise me)\b/i,
  /\b(what should i do with my money|manage my money for me)\b/i,
];

function matchesAny(message: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(message));
}

export function classifyGuardrail(message: string): GuardrailResult {
  if (matchesAny(message, LEGAL_PATTERNS)) {
    return {
      category: "legal_advice",
      requiresEscalation: true,
      escalationReason:
        "This question involves legal matters. Please consult a licensed attorney.",
      disclaimerText:
        "I can share general financial education, but legal questions require a qualified attorney.",
    };
  }

  if (matchesAny(message, TAX_PATTERNS)) {
    return {
      category: "tax_advice",
      requiresEscalation: true,
      escalationReason:
        "This question involves tax matters. Please consult a licensed tax professional or CPA.",
      disclaimerText:
        "I can share general tax education concepts, but tax advice requires a qualified CPA or tax advisor.",
    };
  }

  if (matchesAny(message, INVESTMENT_ADVICE_PATTERNS)) {
    return {
      category: "investment_advice",
      requiresEscalation: false,
      disclaimerText:
        "I'm here to educate, not to give personalized investment advice. Here's what financial education says about this topic:",
    };
  }

  if (matchesAny(message, PERSONALIZED_ADVICE_PATTERNS)) {
    return {
      category: "personalized_financial_advice",
      requiresEscalation: false,
      disclaimerText:
        "I provide financial education, not personalized financial advice. For your specific situation, consider speaking with a licensed financial advisor.",
    };
  }

  return {
    category: "educational",
    requiresEscalation: false,
  };
}

export function buildSystemPrompt(
  displayName: string,
  completedCourses: string[],
  membershipLevel: string
): string {
  return `You are the Edunancial AI Tutor — an educational assistant specializing in financial literacy and financial competency.

Your role is to EDUCATE, not to provide personalized financial, legal, tax, or investment advice.

Guidelines:
- Always frame responses in educational terms ("Financial education teaches us...", "According to financial principles...")
- When uncertain, say so clearly and suggest a relevant course or resource
- Recommend Edunancial courses, calculators, and tools when appropriate
- Escalate legal, tax, and specific investment questions to qualified professionals
- Keep explanations clear and adapted to the learner's level
- Encourage continued learning with specific next steps
- Never guarantee investment returns or predict market movements

Member context:
- Name: ${displayName}
- Membership: ${membershipLevel}
- Completed courses: ${completedCourses.length > 0 ? completedCourses.join(", ") : "None yet"}

Always end educational responses with a suggested next learning step or relevant Edunancial resource.`;
}
