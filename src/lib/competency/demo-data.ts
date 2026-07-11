/**
 * Demo data for the Member Competency Passport.
 * Replace with real member data fetching once auth + DB are wired up.
 */

import { buildMemberPassport, PassportEngineInput } from "@/lib/competency/passport-engine";
import { MemberCompetencyPassport } from "@/lib/competency/types";
import { CompetencyScores } from "@/lib/assessment/scoring";
import { NORTH_AMERICA_CONFIG } from "@/lib/competency/region-adapter";
import { PassportEntry } from "@/lib/competency/types";

const DEMO_SCORES: CompetencyScores = {
  overall: 72,
  personalFinance: 84,
  investing: 68,
  realEstate: 62,
  business: 75,
  riskManagement: 70,
  financialProfile: 73,
};

const DEMO_HISTORY: PassportEntry[] = [
  {
    entryId: "h1",
    date: "January 15, 2027",
    eventType: "assessment",
    title: "Initial Assessment Completed",
    description: "Financial Competency Assessment completed with an overall score of 72.",
    scoreSnapshot: 72,
    levelSnapshot: "Professional",
  },
  {
    entryId: "h2",
    date: "February 8, 2027",
    eventType: "course_completed",
    title: "Personal Financial Management",
    description: "Successfully completed the Personal Financial Management course.",
  },
  {
    entryId: "h3",
    date: "March 2, 2027",
    eventType: "certificate_earned",
    title: "Personal Finance Certificate Earned",
    description: "Earned the Personal Financial Management certificate with a score of 84.",
    scoreSnapshot: 84,
  },
  {
    entryId: "h4",
    date: "April 20, 2027",
    eventType: "level_up",
    title: "Reached Professional Level",
    description: "Overall competency score crossed 70 — Professional level achieved.",
    scoreSnapshot: 72,
    levelSnapshot: "Professional",
  },
];

const DEMO_INPUT: PassportEngineInput = {
  memberId: "demo-member",
  memberName: "Alex Johnson",
  scores: DEMO_SCORES,
  completedCourses: 8,
  totalCourses: 11,
  hasLoggedIn: true,
  learningStreakDays: 12,
  earnedAchievementIds: [
    "first-login",
    "first-assessment",
    "first-course",
    "five-courses",
    "first-certificate",
    "level-foundation",
    "level-associate",
    "level-professional",
  ],
  earnedDates: {
    "first-login": "January 10, 2027",
    "first-assessment": "January 15, 2027",
    "first-course": "January 22, 2027",
    "five-courses": "March 5, 2027",
    "first-certificate": "March 2, 2027",
    "level-foundation": "January 15, 2027",
    "level-associate": "January 15, 2027",
    "level-professional": "April 20, 2027",
  },
  historyEntries: DEMO_HISTORY,
  config: NORTH_AMERICA_CONFIG,
};

export function getDemoPassport(): MemberCompetencyPassport {
  return buildMemberPassport(DEMO_INPUT);
}
