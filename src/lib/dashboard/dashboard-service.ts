import { courseList } from "../../data/course-platform";
import {
  LEVEL_CODES,
  NORTH_AMERICA_TRACKS,
  getAdaptiveLearningExperience,
  type AdaptiveTrackCode,
} from "../adaptive-learning";
import { nextRank, passportRank, passportStatus, pointsToNextRank } from "../assessment/passport";
import type { AuthUser } from "../authContext";
import { getLibraryItem } from "../library/libraryData";
import { EDUNANCIAL_CERTIFICATE_DISCLAIMER } from "../positioning";

const TRACK_ORDER = ["RED", "WHITE", "BLUE"] as const satisfies readonly AdaptiveTrackCode[];

const TRACK_COURSE_IDS: Record<AdaptiveTrackCode, string> = {
  RED: "red-real-estate",
  WHITE: "white-paper-assets",
  BLUE: "blue-business",
};

const MEMBERSHIP_LEVELS: Record<
  AuthUser["membershipTier"],
  "Member Access" | "Individual Membership" | "Approved Organization Membership" | "100+ Member Organization Rate" | "Beta Tester"
> = {
  free: "Member Access",
  basic: "Individual Membership",
  premium: "Approved Organization Membership",
  enterprise: "100+ Member Organization Rate",
  beta: "Beta Tester",
};

const DOWNLOAD_ITEM_IDS = [
  { itemId: "book-rwb", category: "Books" },
  { itemId: "book-profit", category: "Books" },
  { itemId: "pdf-re-terms", category: "PDFs" },
  { itemId: "pdf-budget-worksheet", category: "Worksheets" },
  { itemId: "pdf-business-plan", category: "Worksheets" },
  { itemId: "audio-rwb", category: "Audio" },
  { itemId: "audio-profit", category: "Audio" },
  { itemId: "epub-family-finance", category: "Books" },
] as const;

const ANNOUNCEMENTS = [
  {
    id: "north-america-launch",
    title: "North American member dashboard is now live",
    detail: "Track learning progress, passport milestones, completion recognition, and downloads from one place.",
    href: "/dashboard",
    date: "July 2026",
  },
  {
    id: "curriculum-release",
    title: "Red, White, and Blue learning paths refreshed",
    detail: "Updated lesson sequencing and clearer next-lesson guidance are available in all three launch tracks.",
    href: "/continue-learning",
    date: "July 2026",
  },
  {
    id: "library-update",
    title: "New worksheets and audio resources added",
    detail: "Members can now open budget worksheets, business templates, and audio titles directly from the dashboard.",
    href: "/library",
    date: "June 2026",
  },
] as const;

export interface DashboardLearningPath {
  code: AdaptiveTrackCode;
  title: string;
  courseId: string;
  courseTitle: string;
  completionPercentage: number;
  currentLevel: string;
  nextLessonTitle: string;
  nextLessonLabel: string;
  assessmentStatus: string;
  certificatesEarned: number;
}

export interface DashboardContinueLearning {
  trackCode: AdaptiveTrackCode;
  trackTitle: string;
  completionPercentage: number;
  currentLevel: string;
  lessonTitle: string;
  lessonLabel: string;
  href: string;
}

export interface DashboardPassportProgress {
  rank: string;
  status: string;
  overallScore: number | null;
  completionPercentage: number;
  lessonsCompleted: number;
  totalLessons: number;
  certificatesEarned: number;
  recommendedTrack: string;
  nextRank: string;
  pointsToNextRank: number;
}

export interface DashboardCertificate {
  id: string;
  title: string;
  trackTitle: string;
  level: string;
  completionPercentage: number;
}

export interface DashboardDownload {
  id: string;
  title: string;
  category: "Books" | "PDFs" | "Worksheets" | "Audio";
  format: string;
  accessLevel: string;
  href: string;
}

export interface DashboardAnnouncement {
  id: string;
  title: string;
  detail: string;
  href: string;
  date: string;
}

export interface DashboardData {
  memberName: string;
  subscriptionLevel: "Member Access" | "Individual Membership" | "Approved Organization Membership" | "100+ Member Organization Rate" | "Beta Tester";
  assessmentCompleted: boolean;
  competencyScore: number | null;
  courseCompletionPercentage: number;
  certificatesEarned: number;
  downloadsAvailable: number;
  learningPaths: DashboardLearningPath[];
  continueLearning: DashboardContinueLearning;
  passport: DashboardPassportProgress;
  earnedCertificates: DashboardCertificate[];
  certificatesInProgress: DashboardCertificate[];
  downloads: DashboardDownload[];
  announcements: DashboardAnnouncement[];
}

export function getSubscriptionLevel(
  membershipTier: AuthUser["membershipTier"],
): "Member Access" | "Individual Membership" | "Approved Organization Membership" | "100+ Member Organization Rate" | "Beta Tester" {
  return MEMBERSHIP_LEVELS[membershipTier];
}

export function getDashboardData(user: AuthUser): DashboardData {
  const adaptiveLearning = getAdaptiveLearningExperience(user.id);
  const learningPaths = TRACK_ORDER.map((trackCode) => {
    const track = adaptiveLearning.studentProgress.tracks[trackCode];
    const courseId = TRACK_COURSE_IDS[trackCode];
    const courseTitle =
      courseList.find((course) => course.id === courseId)?.title ?? NORTH_AMERICA_TRACKS[trackCode];

    return {
      code: trackCode,
      title: NORTH_AMERICA_TRACKS[trackCode],
      courseId,
      courseTitle,
      completionPercentage: track.completionPercentage,
      currentLevel: track.currentLevel,
      nextLessonTitle: track.nextLesson?.title ?? `${NORTH_AMERICA_TRACKS[trackCode]} curriculum queue`,
      nextLessonLabel: track.nextLesson?.id ?? "Awaiting next lesson unlock",
      assessmentStatus: track.assessmentStatus,
      certificatesEarned: track.certificatesEarned.length,
    };
  });

  const continueTrackCode = adaptiveLearning.recommendedTrack;
  const continueTrack = adaptiveLearning.studentProgress.tracks[continueTrackCode];
  const earnedCertificates = learningPaths.flatMap((path) => {
    const track = adaptiveLearning.studentProgress.tracks[path.code];

    return track.certificatesEarned.map((certificateId) => {
      const [, level = path.currentLevel] = certificateId.split("-");
      return {
        id: certificateId,
        title: `${path.title} ${level} Certificate of Completion`,
        trackTitle: path.title,
        level,
        completionPercentage: 100,
      };
    });
  });

  const certificatesInProgress: DashboardCertificate[] = learningPaths.flatMap((path) => {
    const nextLevel = LEVEL_CODES[path.certificatesEarned];
    if (!nextLevel) {
      return [];
    }

    return [
      {
        id: `${path.code}-${nextLevel}-IN-PROGRESS`,
        title: `${path.title} ${nextLevel} Certificate of Completion`,
        trackTitle: path.title,
        level: nextLevel,
        completionPercentage: Math.min(99, Math.max(path.completionPercentage, 20)),
      },
    ];
  });

  const downloads = DOWNLOAD_ITEM_IDS.map(({ itemId, category }) => {
    const item = getLibraryItem(itemId);
    if (!item || !item.downloadable || !item.fileFormat) {
      throw new Error(`Dashboard download item "${itemId}" is missing or not downloadable.`);
    }

    return {
      id: item.id,
      title: item.title,
      category,
      format: item.fileFormat.toUpperCase(),
      accessLevel: item.accessLevel,
      href: `/library/${item.id}`,
    };
  });

  const completionPercentage = adaptiveLearning.studentProgress.completionPercentage;
  const score = user.assessmentCompleted ? (user.overallScore ?? null) : null;

  return {
    memberName: user.firstName,
    subscriptionLevel: getSubscriptionLevel(user.membershipTier),
    assessmentCompleted: user.assessmentCompleted,
    competencyScore: score,
    courseCompletionPercentage: completionPercentage,
    certificatesEarned: earnedCertificates.length,
    downloadsAvailable: downloads.length,
    learningPaths,
    continueLearning: {
      trackCode: continueTrackCode,
      trackTitle: NORTH_AMERICA_TRACKS[continueTrackCode],
      completionPercentage: continueTrack.completionPercentage,
      currentLevel: continueTrack.currentLevel,
      lessonTitle: continueTrack.nextLesson?.title ?? `${NORTH_AMERICA_TRACKS[continueTrackCode]} curriculum queue`,
      lessonLabel: continueTrack.nextLesson?.id ?? "Awaiting next lesson unlock",
      href: `/courses/${TRACK_COURSE_IDS[continueTrackCode]}`,
    },
    passport: {
      rank: score !== null ? passportRank(score) : "Student",
      status: score !== null ? passportStatus(score) : "Active",
      overallScore: score,
      completionPercentage,
      lessonsCompleted: adaptiveLearning.studentProgress.lessonsCompleted.length,
      totalLessons: adaptiveLearning.curriculumCatalog.length,
      certificatesEarned: earnedCertificates.length,
      recommendedTrack: NORTH_AMERICA_TRACKS[continueTrackCode],
      nextRank: score !== null ? nextRank(score) : "Foundation",
      pointsToNextRank: score !== null ? pointsToNextRank(score) : 40,
    },
    earnedCertificates,
    certificatesInProgress,
    downloads,
    announcements: [...ANNOUNCEMENTS],
  };
}

export const DASHBOARD_CERTIFICATE_DISCLAIMER = EDUNANCIAL_CERTIFICATE_DISCLAIMER;
