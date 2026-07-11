/**
 * Competency Passport — Achievement Engine
 *
 * Defines all global achievements and evaluates which are earned
 * based on a member's passport data. Future regions append
 * region-specific achievements via RegionPassportConfig.additionalAchievements.
 */

import { PassportAchievement } from "./types";

// ─── Global Achievement Definitions ──────────────────────────────────────────

const GLOBAL_ACHIEVEMENTS: Omit<PassportAchievement, "earned" | "earnedAt">[] =
  [
    // Learning achievements
    {
      id: "first-login",
      title: "Journey Begins",
      description: "Logged into Edunancial for the first time.",
      icon: "🚀",
      category: "learning",
    },
    {
      id: "first-assessment",
      title: "Self-Aware",
      description: "Completed your first Financial Competency Assessment.",
      icon: "📊",
      category: "assessment",
    },
    {
      id: "first-course",
      title: "First Step",
      description: "Completed your first course.",
      icon: "📖",
      category: "learning",
    },
    {
      id: "five-courses",
      title: "Learning Momentum",
      description: "Completed 5 courses.",
      icon: "🔥",
      category: "learning",
    },
    {
      id: "ten-courses",
      title: "Knowledge Builder",
      description: "Completed 10 courses.",
      icon: "💡",
      category: "learning",
    },
    {
      id: "all-courses",
      title: "Complete Scholar",
      description: "Completed all available courses.",
      icon: "🎓",
      category: "learning",
    },

    // Certificate achievements
    {
      id: "first-certificate",
      title: "Certified",
      description: "Earned your first certificate.",
      icon: "📜",
      category: "certificate",
    },
    {
      id: "three-certificates",
      title: "Triple Certified",
      description: "Earned 3 certificates.",
      icon: "🥉",
      category: "certificate",
    },
    {
      id: "six-certificates",
      title: "Certified Professional",
      description: "Earned all 6 competency certificates.",
      icon: "🏅",
      category: "certificate",
    },

    // Level achievements
    {
      id: "level-foundation",
      title: "Foundation Built",
      description: "Reached Foundation competency level.",
      icon: "🏗️",
      category: "level",
    },
    {
      id: "level-associate",
      title: "Associate Status",
      description: "Reached Associate competency level.",
      icon: "⭐",
      category: "level",
    },
    {
      id: "level-professional",
      title: "Professional",
      description: "Reached Professional competency level.",
      icon: "🏆",
      category: "level",
    },
    {
      id: "level-expert",
      title: "Expert",
      description: "Reached Expert competency level.",
      icon: "💎",
      category: "level",
    },
    {
      id: "level-master",
      title: "Financial Master",
      description: "Reached the pinnacle — Master competency level.",
      icon: "👑",
      category: "level",
    },

    // Streak achievements
    {
      id: "streak-7",
      title: "Week Warrior",
      description: "Maintained a 7-day learning streak.",
      icon: "🗓️",
      category: "streak",
    },
    {
      id: "streak-30",
      title: "Monthly Dedicant",
      description: "Maintained a 30-day learning streak.",
      icon: "📅",
      category: "streak",
    },
  ];

// ─── Evaluation ───────────────────────────────────────────────────────────────

export interface AchievementInput {
  completedCourses: number;
  totalCourses: number;
  certificatesEarned: number;
  overallScore: number;
  assessmentCompleted: boolean;
  hasLoggedIn: boolean;
  learningStreakDays: number;
  earnedAchievementIds?: string[];
  earnedDates?: Record<string, string>;
}

export function evaluateAchievements(
  input: AchievementInput,
  additionalDefinitions: Omit<
    PassportAchievement,
    "earned" | "earnedAt"
  >[] = []
): PassportAchievement[] {
  const all = [...GLOBAL_ACHIEVEMENTS, ...additionalDefinitions];
  const earned = new Set(input.earnedAchievementIds ?? []);
  const dates = input.earnedDates ?? {};

  return all.map((def) => {
    const wasAlreadyEarned = earned.has(def.id);
    const nowEarned = wasAlreadyEarned || isEarned(def.id, input);

    return {
      ...def,
      earned: nowEarned,
      earnedAt: nowEarned
        ? (dates[def.id] ?? new Date().toLocaleDateString())
        : null,
    };
  });
}

function isEarned(id: string, input: AchievementInput): boolean {
  switch (id) {
    case "first-login":
      return input.hasLoggedIn;
    case "first-assessment":
      return input.assessmentCompleted;
    case "first-course":
      return input.completedCourses >= 1;
    case "five-courses":
      return input.completedCourses >= 5;
    case "ten-courses":
      return input.completedCourses >= 10;
    case "all-courses":
      return (
        input.totalCourses > 0 &&
        input.completedCourses >= input.totalCourses
      );
    case "first-certificate":
      return input.certificatesEarned >= 1;
    case "three-certificates":
      return input.certificatesEarned >= 3;
    case "six-certificates":
      return input.certificatesEarned >= 6;
    case "level-foundation":
      return input.overallScore >= 40;
    case "level-associate":
      return input.overallScore >= 55;
    case "level-professional":
      return input.overallScore >= 70;
    case "level-expert":
      return input.overallScore >= 85;
    case "level-master":
      return input.overallScore >= 95;
    case "streak-7":
      return input.learningStreakDays >= 7;
    case "streak-30":
      return input.learningStreakDays >= 30;
    default:
      return false;
  }
}

export function countEarnedAchievements(
  achievements: PassportAchievement[]
): number {
  return achievements.filter((a) => a.earned).length;
}
