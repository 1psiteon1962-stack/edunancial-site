// ─── AI Tutor Service ─────────────────────────────────────────────────────────
// Provider-agnostic service layer. Swap the provider without touching UI.

import type { AITutorRequest, AITutorResponse, ChatMessage } from "./types";
import { classifyGuardrail } from "./guardrails";

let _messageIdCounter = 1;
function generateMessageId(): string {
  return `msg-${Date.now()}-${_messageIdCounter++}`;
}

// ─── Mock Provider (default — replace with real AI provider) ──────────────────

async function mockAIResponse(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  // Placeholder: returns an educational acknowledgement.
  // In production, route through OpenAI / Anthropic / Google.
  void history;
  const lower = message.toLowerCase();

  if (lower.includes("compound interest")) {
    return "**Compound interest** is often called the *eighth wonder of the world*. It means earning interest on your interest — turning time into a wealth-building engine.\n\n**Formula:** A = P(1 + r/n)^(nt)\n\nFor example, $10,000 invested at 8% annually for 30 years grows to approximately **$100,627** — without adding a single extra dollar.\n\n> 💡 **Next step:** Check out our *Investing Fundamentals* course to see compound interest in action with real portfolios.";
  }

  if (lower.includes("budget") || lower.includes("50/30/20")) {
    return "The **50/30/20 rule** is a simple framework:\n\n| Category | Allocation | Examples |\n|---|---|---|\n| Needs | 50% | Rent, food, utilities |\n| Wants | 30% | Entertainment, dining |\n| Savings/Debt | 20% | Emergency fund, investing |\n\nIt's a starting point — not a law. High cost-of-living areas may need a 60/20/20 split.\n\n> 💡 **Try it:** Use our Budget Calculator to customize this rule for your income.";
  }

  if (lower.includes("emergency fund")) {
    return "An **emergency fund** is 3–6 months of essential expenses kept in a high-yield savings account.\n\n**Why it matters:**\n- Prevents you from going into debt during a crisis\n- Removes financial anxiety\n- Allows you to take career and business risks\n\n**How to start:** Save $1,000 first (your starter fund), then build to 3 months, then 6.\n\n> 💡 **Continue learning:** *Building Your Emergency Fund* course walks you through every step.";
  }

  return `Great question! Financial education teaches us that **${message.slice(0, 50)}** is a topic worth exploring deeply.\n\nHere's what the principles of financial literacy say:\n\n1. Understanding the fundamentals builds a strong foundation\n2. Consistent application over time creates lasting results\n3. Knowledge compounds just like money\n\n> 💡 **Suggested:** Explore our course catalog for lessons directly related to your question.`;
}

// ─── Main Service Function ────────────────────────────────────────────────────

export async function sendAITutorMessage(
  request: AITutorRequest
): Promise<AITutorResponse> {
  const { message, conversationHistory, memberContext } = request;

  // 1. Classify with guardrails
  const guardrail = classifyGuardrail(message);

  // 2. If escalation required, return early with escalation response
  if (guardrail.requiresEscalation) {
    return {
      messageId: generateMessageId(),
      content: `${guardrail.disclaimerText}\n\n**For your specific situation:** ${guardrail.escalationReason}\n\nI'm happy to provide general education on related financial concepts. What would you like to learn?`,
      guardrailCategory: guardrail.category,
      citations: [],
      suggestedResources: [],
      followUpQuestions: [
        "What are the basics of financial planning?",
        "How do I find a qualified financial advisor?",
        "What financial concepts should everyone know?",
      ],
      escalationRequired: true,
      escalationReason: guardrail.escalationReason,
    };
  }

  // 3. Build response (with optional disclaimer prefix)
  let rawContent = await mockAIResponse(message, conversationHistory);

  if (guardrail.disclaimerText) {
    rawContent = `*${guardrail.disclaimerText}*\n\n${rawContent}`;
  }

  // 4. Build follow-up questions based on member context
  const followUpQuestions = buildFollowUps(message, memberContext.profile.learningGoals);

  return {
    messageId: generateMessageId(),
    content: rawContent,
    guardrailCategory: guardrail.category,
    citations: [],
    suggestedResources: [
      {
        id: "course-catalog",
        title: "Browse All Courses",
        type: "course",
        url: "/courses",
        relevanceScore: 0.8,
      },
    ],
    followUpQuestions,
    escalationRequired: false,
  };
}

function buildFollowUps(message: string, goals: string[]): string[] {
  const lower = message.toLowerCase();
  const questions: string[] = [];

  if (lower.includes("invest")) {
    questions.push("What is the difference between active and passive investing?");
    questions.push("How does dollar-cost averaging work?");
  } else if (lower.includes("budget")) {
    questions.push("How do I track my spending automatically?");
    questions.push("What is zero-based budgeting?");
  } else if (lower.includes("debt")) {
    questions.push("Should I pay off debt or invest first?");
    questions.push("What is a good debt-to-income ratio?");
  } else {
    if (goals.includes("investing")) questions.push("What is compound interest?");
    if (goals.includes("budgeting")) questions.push("How do I start a budget?");
    questions.push("What is a financial competency score?");
  }

  return questions.slice(0, 3);
}
