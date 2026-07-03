import { businessQuestions } from "@/data/businessQuestions";

export interface BusinessAssessmentResult {
  competencyScore: number;
  competencyLevel: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export function scoreBusinessAssessment(
  answers: Record<string, string>
): BusinessAssessmentResult {

  let score = 0;

  Object.values(answers).forEach((answer) => {

    switch (answer) {

      case "Excellent":
      case "Very High":
      case "Daily":
      case "Multiple Sources":
      case "Yes":
        score += 10;
        break;

      case "Good":
      case "High":
      case "Usually":
      case "Several times per week":
        score += 8;
        break;

      case "Average":
      case "Weekly":
      case "Break-even":
        score += 6;
        break;

      case "Monthly":
      case "Occasionally":
      case "Low":
        score += 4;
        break;

      default:
        score += 2;
    }

  });

  let competencyLevel = "";

  if (score >= 85)
    competencyLevel = "Expert";

  else if (score >= 70)
    competencyLevel = "Advanced";

  else if (score >= 55)
    competencyLevel = "Competent";

  else if (score >= 40)
    competencyLevel = "Developing";

  else
    competencyLevel = "Foundation";

  return {

    competencyScore: score,

    competencyLevel,

    strengths: [],

    weaknesses: [],

    recommendations: []

  };

}
