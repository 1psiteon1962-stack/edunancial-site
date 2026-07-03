import { businessCourses } from "@/data/businessCourses";

export interface StudentProfile {
  competencyLevel: string;
  stage: string;
  weaknesses: string[];
}

export function recommendCourses(
  profile: StudentProfile
) {

  const recommendations = [];

  if (
    profile.weaknesses.includes("cashFlow")
  ) {
    recommendations.push(
      businessCourses.find(
        c => c.id === "cash-flow"
      )
    );
  }

  if (
    profile.weaknesses.includes("profit")
  ) {
    recommendations.push(
      businessCourses.find(
        c => c.id === "profit-first"
      )
    );
  }

  if (
    profile.weaknesses.includes("pricing")
  ) {
    recommendations.push(
      businessCourses.find(
        c => c.id === "pricing"
      )
    );
  }

  if (
    profile.weaknesses.includes("sales")
  ) {
    recommendations.push(
      businessCourses.find(
        c => c.id === "sales"
      )
    );
  }

  if (
    profile.weaknesses.includes("marketing")
  ) {
    recommendations.push(
      businessCourses.find(
        c => c.id === "marketing"
      )
    );
  }

  if (
    profile.weaknesses.includes("leadership")
  ) {
    recommendations.push(
      businessCourses.find(
        c => c.id === "leadership"
      )
    );
  }

  if (
    profile.weaknesses.includes("hiring")
  ) {
    recommendations.push(
      businessCourses.find(
        c => c.id === "hiring"
      )
    );
  }

  if (
    profile.weaknesses.includes("systems")
  ) {
    recommendations.push(
      businessCourses.find(
        c => c.id === "systems"
      )
    );
  }

  if (
    profile.stage === "scale"
  ) {
    recommendations.push(
      businessCourses.find(
        c => c.id === "scale"
      )
    );
  }

  return recommendations.filter(Boolean);

}
