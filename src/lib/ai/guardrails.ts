export type Competency = "beginner" | "intermediate" | "advanced";

export interface CoachRequest {
  competency: Competency;
  topic: string;
  asksForSpecificInvestment: boolean;
}

export interface CoachResponse {
  permitted: boolean;
  message: string;
  redirectToMarketplace: boolean;
}

const INVESTMENT_ADVICE_MESSAGE =
  "Edunancial does not recommend specific stocks, businesses, cryptocurrencies, real estate, or other investments. Explain your reasoning and evidence. If you need individualized advice, use the Marketplace to consult a licensed professional.";

const BEGINNER_MESSAGE =
  "Explain the concept in simple language, ask one question at a time, and verify understanding before continuing.";

const INTERMEDIATE_MESSAGE =
  "Challenge assumptions, discuss risk, liquidity, cash flow, ROI, and opportunity cost.";

const ADVANCED_MESSAGE =
  "Require evidence, multiple scenarios, quantitative reasoning, and discussion of competing viewpoints.";

const INVALID_COMPETENCY_MESSAGE =
  "I can help with general financial education. Please choose beginner, intermediate, or advanced.";

function assertNever(value: never): never {
  throw new Error(`Unhandled competency value: ${String(value)}`);
}

function isCompetency(value: string): value is Competency {
  return (
    value === "beginner" || value === "intermediate" || value === "advanced"
  );
}

export function evaluateCoachRequest(request: CoachRequest): CoachResponse {
  if (request.asksForSpecificInvestment) {
    return {
      permitted: false,
      redirectToMarketplace: true,
      message: INVESTMENT_ADVICE_MESSAGE,
    };
  }

  const competency = request.competency as string;

  if (!isCompetency(competency)) {
    return {
      permitted: false,
      redirectToMarketplace: false,
      message: INVALID_COMPETENCY_MESSAGE,
    };
  }

  switch (competency) {
    case "beginner":
      return {
        permitted: true,
        redirectToMarketplace: false,
        message: BEGINNER_MESSAGE,
      };
    case "intermediate":
      return {
        permitted: true,
        redirectToMarketplace: false,
        message: INTERMEDIATE_MESSAGE,
      };
    case "advanced":
      return {
        permitted: true,
        redirectToMarketplace: false,
        message: ADVANCED_MESSAGE,
      };
    default:
      return assertNever(competency);
  }
}
