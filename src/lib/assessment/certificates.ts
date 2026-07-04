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



export function earnedCertificates(
  scores: CompetencyScores
): number {

  return generateCertificates(scores).filter(
    (certificate) => certificate.earned
  ).length;

}

export function certificateCompletionPercentage(
  scores: CompetencyScores
): number {

  const total = generateCertificates(scores).length;

  const earned = earnedCertificates(scores);

  return Math.round((earned / total) * 100);

}

export function nextCertificate(
  scores: CompetencyScores
): Certificate | null {

  const certificates = generateCertificates(scores);

  const next = certificates.find(
    (certificate) => !certificate.earned
  );

  return next ?? null;

}

export function qualifiesForMasterCertification(
  scores: CompetencyScores
): boolean {

  return (
    scores.overall >= 95 &&
    scores.personalFinance >= 90 &&
    scores.investing >= 90 &&
    scores.realEstate >= 90 &&
    scores.business >= 90 &&
    scores.riskManagement >= 90 &&
    scores.financialProfile >= 90
  );

}

export function certificateProgress(
  score: number,
  minimumScore: number
): number {

  return Math.min(
    100
    Math round (score / minimumScore)
*  100
  );

  )
    
