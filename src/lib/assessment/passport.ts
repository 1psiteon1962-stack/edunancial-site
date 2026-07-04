import { CompetencyScores } from "./scoring";

export interface PassportRecord {

  assessmentDate: string;

  overallScore: number;

  competencyLevel: string;

  certificatesEarned: number;

}

export function buildPassportRecord(
  scores: CompetencyScores,
  competencyLevel: string,
  certificatesEarned: number
): PassportRecord {

  return {

    assessmentDate: new Date().toLocaleDateString(),

    overallScore: scores.overall,

    competencyLevel,

    certificatesEarned,

  };

}

export function passportRank(
  overallScore: number
): string {

  if (overallScore >= 95) return "Master";

  if (overallScore >= 85) return "Expert";

  if (overallScore >= 70) return "Professional";

  if (overallScore >= 55) return "Associate";

  if (overallScore >= 40) return "Foundation";

  return "Student";

}

export function yearsOfProgress(
  firstAssessment: Date
): number {

  const today = new Date();

  return Math.max(
    0,
    today.getFullYear() - firstAssessment.getFullYear()
  );

}


export function nextRank(
  overallScore: number
): string {

  if (overallScore < 40) return "Foundation";

  if (overallScore < 55) return "Associate";

  if (overallScore < 70) return "Professional";

  if (overallScore < 85) return "Expert";

  if (overallScore < 95) return "Master";

  return "Elite";

}

export function pointsToNextRank(
  overallScore: number
): number {

  if (overallScore < 40) return 40 - overallScore;

  if (overallScore < 55) return 55 - overallScore;

  if (overallScore < 70) return 70 - overallScore;

  if (overallScore < 85) return 85 - overallScore;

  if (overallScore < 95) return 95 - overallScore;

  return 0;

}

export function passportCompletion(
  completedCourses: number,
  totalCourses: number
): number {

  if (totalCourses <= 0) return 0;

  return Math.round(
    (completedCourses / totalCourses) * 100
  );

}

export function passportStatus(
  overallScore: number
): "Active" | "Excellent" | "Master" {

  if (overallScore >= 95) return "Master";

  if (overallScore >= 80) return "Excellent";

  return "Active";

}

export function eligibleForRecognition(
  overallScore: number,
  certificates: number
): boolean {

  return (
    overallScore >= 90 &&
    certificates >= 5
  );

}
