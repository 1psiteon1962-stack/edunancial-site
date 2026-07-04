import { CompetencyScores } from "./scoring";

export interface Certificate {

  id: string;

  title: string;

  category: string;

  minimumScore: number;

  earned: boolean;

}

export function generateCertificates(
  scores: CompetencyScores
): Certificate[] {

  return [

    {
      id: "personal-finance",
      title: "Personal Financial Management",
      category: "Personal Finance",
      minimumScore: 80,
      earned: scores.personalFinance >= 80,
    },

    {
      id: "investing",
      title: "Investing Fundamentals",
      category: "Paper Assets",
      minimumScore: 80,
      earned: scores.investing >= 80,
    },

    {
      id: "real-estate",
      title: "Real Estate Foundations",
      category: "Real Estate",
      minimumScore: 80,
      earned: scores.realEstate >= 80,
    },

    {
      id: "business",
      title: "Business Fundamentals",
      category: "Business",
      minimumScore: 80,
      earned: scores.business >= 80,
    },

    {
      id: "risk-management",
      title: "Risk Management",
      category: "Risk",
      minimumScore: 80,
      earned: scores.riskManagement >= 80,
    },

    {
      id: "financial-competency",
      title: "Financial Competency",
      category: "Overall",
      minimumScore: 85,
      earned: scores.overall >= 85,
    },

  ];

}































































