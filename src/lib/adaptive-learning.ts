import curriculumRegistry from "../../curriculum/registry.json";

export const NORTH_AMERICA_TRACKS = {
  RED: "Real Estate",
  WHITE: "Paper Assets",
  BLUE: "Business",
} as const;

export const TRACK_COLOR_STYLES = {
  RED: "bg-red-500",
  WHITE: "bg-white",
  BLUE: "bg-blue-500",
} as const;

export const TRACK_SURFACE_STYLES = {
  RED: "border-red-500/40 bg-red-500/10",
  WHITE: "border-white/20 bg-white/5",
  BLUE: "border-blue-500/40 bg-blue-500/10",
} as const;

export const TRACK_TEXT_STYLES = {
  RED: "text-red-300",
  WHITE: "text-white",
  BLUE: "text-blue-300",
} as const;

export const LEVEL_CODES = ["L1", "L2", "L3", "L4", "L5"] as const;

export type AdaptiveTrackCode = keyof typeof NORTH_AMERICA_TRACKS;
export type AdaptiveLevelCode = (typeof LEVEL_CODES)[number];

export interface AssessmentResult {
  curriculumId?: string;
  track: AdaptiveTrackCode;
  level: AdaptiveLevelCode;
  score: number;
  masteryThreshold: number;
  mastered: boolean;
  completedAt: string;
}

export interface AdaptiveLessonRecord {
  id: string;
  track: AdaptiveTrackCode;
  trackName: string;
  level: AdaptiveLevelCode;
  lessonNumber: number;
  title: string;
  path: string;
  metadata: Record<string, string>;
}

export interface StudentTrackProgressRecord {
  currentLevel: AdaptiveLevelCode;
  currentLesson: string | null;
  lessonsCompleted: string[];
  assessmentScores: Record<AdaptiveLevelCode, number | null>;
  assessmentResults: AssessmentResult[];
  timeCompleted: Record<string, string>;
  completionPercentage: number;
  certificatesEarned: string[];
  lastLogin: string;
  competencyColor: AdaptiveTrackCode;
  competencyLevel: AdaptiveLevelCode;
  nextLesson: AdaptiveLessonRecord | null;
  assessmentStatus: string;
  unlockedLessons: string[];
}

export interface StudentProgressDatabaseRecord {
  studentId: string;
  currentLevel: AdaptiveLevelCode;
  currentColor: AdaptiveTrackCode;
  currentLesson: string | null;
  lessonsCompleted: string[];
  assessmentScores: AssessmentResult[];
  timeCompleted: Record<string, string>;
  completionPercentage: number;
  certificatesEarned: string[];
  lastLogin: string;
  tracks: Record<AdaptiveTrackCode, StudentTrackProgressRecord>;
}

export interface AdaptiveLearningDashboardWidget {
  id:
    | "current-level"
    | "current-color"
    | "next-lesson"
    | "assessment-status"
    | "completion"
    | "certificates";
  label: string;
  value: string;
}

export interface AdaptiveLearningExperience {
  masteryThreshold: number;
  curriculumCatalog: AdaptiveLessonRecord[];
  studentProgress: StudentProgressDatabaseRecord;
  dashboardWidgets: AdaptiveLearningDashboardWidget[];
  recommendedTrack: AdaptiveTrackCode;
}

type RegistryAsset = {
  id?: string;
  type?: string;
  track?: string;
  trackName?: string;
  level?: number;
  lessonNumber?: number;
  title?: string;
  path?: string;
  metadata?: Record<string, string>;
};

type RegistryTrack = {
  levels?: Record<string, { assets?: Record<string, RegistryAsset> }>;
};

type RegistryFile = {
  tracks?: Record<string, RegistryTrack>;
};

const CURRICULUM_ID_PATTERN = /^(RED|WHITE|BLUE)-L([1-5])-([0-9]{3})$/;
const TRACK_ORDER = Object.keys(NORTH_AMERICA_TRACKS) as AdaptiveTrackCode[];
const TRACK_STATE_FIXTURES: Record<
  AdaptiveTrackCode,
  {
    level: AdaptiveLevelCode;
    scores: Partial<Record<AdaptiveLevelCode, number>>;
    focusScore: number;
  }
> = {
  RED: { level: "L2", scores: { L1: 88, L2: 83 }, focusScore: 83 },
  WHITE: { level: "L1", scores: { L1: 81 }, focusScore: 81 },
  BLUE: { level: "L3", scores: { L1: 93, L2: 89, L3: 86 }, focusScore: 86 },
};

export const ADAPTIVE_LEARNING_MASTERY_THRESHOLD = resolveMasteryThreshold(
  process.env.NEXT_PUBLIC_ADAPTIVE_LEARNING_MASTERY_THRESHOLD,
);

export function parseCurriculumId(id: string) {
  const match = id.match(CURRICULUM_ID_PATTERN);
  if (!match) {
    return null;
  }

  const [, track, level, lessonNumber] = match;

  return {
    id,
    track: track as AdaptiveTrackCode,
    level: `L${level}` as AdaptiveLevelCode,
    lessonNumber: Number.parseInt(lessonNumber, 10),
  };
}

export function getAdaptiveLearningExperience(
  studentId = "guest-member",
): AdaptiveLearningExperience {
  const curriculumCatalog = getAdaptiveCurriculumCatalog();
  const studentProgress = buildStudentProgressDatabase(studentId, curriculumCatalog);
  const recommendedTrack = getRecommendedTrack(studentProgress.tracks);

  return {
    masteryThreshold: ADAPTIVE_LEARNING_MASTERY_THRESHOLD,
    curriculumCatalog,
    studentProgress,
    dashboardWidgets: buildDashboardWidgets(studentProgress, recommendedTrack),
    recommendedTrack,
  };
}

export function getAdaptiveCurriculumCatalog(
  registry: RegistryFile = curriculumRegistry,
): AdaptiveLessonRecord[] {
  const lessons: AdaptiveLessonRecord[] = [];

  for (const [trackCode, trackEntry] of Object.entries(registry.tracks ?? {})) {
    if (!isAdaptiveTrackCode(trackCode)) {
      continue;
    }

    for (const levelEntry of Object.values(trackEntry.levels ?? {})) {
      for (const asset of Object.values(levelEntry.assets ?? {})) {
        if (asset.type !== "lesson" || !asset.id) {
          continue;
        }

        const parsedId = parseCurriculumId(asset.id);
        if (!parsedId) {
          continue;
        }

        lessons.push({
          id: asset.id,
          track: parsedId.track,
          trackName: asset.trackName ?? NORTH_AMERICA_TRACKS[parsedId.track],
          level: parsedId.level,
          lessonNumber: asset.lessonNumber ?? parsedId.lessonNumber,
          title: asset.title || asset.id,
          path: asset.path || `/courses/${parsedId.track.toLowerCase()}`,
          metadata: {
            ...(asset.metadata ?? {}),
          },
        });
      }
    }
  }

  return lessons.sort((left, right) => {
    if (left.track !== right.track) {
      return TRACK_ORDER.indexOf(left.track) - TRACK_ORDER.indexOf(right.track);
    }

    if (left.level !== right.level) {
      return LEVEL_CODES.indexOf(left.level) - LEVEL_CODES.indexOf(right.level);
    }

    return left.lessonNumber - right.lessonNumber;
  });
}

function buildStudentProgressDatabase(
  studentId: string,
  curriculumCatalog: AdaptiveLessonRecord[],
): StudentProgressDatabaseRecord {
  const lastLogin = new Date().toISOString();
  const tracks = TRACK_ORDER.reduce<Record<AdaptiveTrackCode, StudentTrackProgressRecord>>(
    (collection, trackCode) => {
      collection[trackCode] = buildTrackProgress(trackCode, curriculumCatalog, lastLogin);
      return collection;
    },
    {} as Record<AdaptiveTrackCode, StudentTrackProgressRecord>,
  );

  const recommendedTrack = getRecommendedTrack(tracks);

  return {
    studentId,
    currentLevel: tracks[recommendedTrack].currentLevel,
    currentColor: recommendedTrack,
    currentLesson: tracks[recommendedTrack].currentLesson,
    lessonsCompleted: TRACK_ORDER.flatMap((trackCode) => tracks[trackCode].lessonsCompleted),
    assessmentScores: TRACK_ORDER.flatMap((trackCode) => tracks[trackCode].assessmentResults),
    timeCompleted: TRACK_ORDER.reduce<Record<string, string>>((collection, trackCode) => {
      return {
        ...collection,
        ...tracks[trackCode].timeCompleted,
      };
    }, {}),
    completionPercentage: average(
      TRACK_ORDER.map((trackCode) => tracks[trackCode].completionPercentage),
    ),
    certificatesEarned: TRACK_ORDER.flatMap((trackCode) => tracks[trackCode].certificatesEarned),
    lastLogin,
    tracks,
  };
}

function buildTrackProgress(
  track: AdaptiveTrackCode,
  curriculumCatalog: AdaptiveLessonRecord[],
  lastLogin: string,
): StudentTrackProgressRecord {
  const fixture = TRACK_STATE_FIXTURES[track];
  const assessmentScores = LEVEL_CODES.reduce<Record<AdaptiveLevelCode, number | null>>(
    (collection, levelCode) => {
      collection[levelCode] = fixture.scores[levelCode] ?? null;
      return collection;
    },
    {} as Record<AdaptiveLevelCode, number | null>,
  );

  const assessmentResults = Object.entries(fixture.scores).map(([level, score]) => ({
    track,
    level: level as AdaptiveLevelCode,
    score,
    masteryThreshold: ADAPTIVE_LEARNING_MASTERY_THRESHOLD,
    mastered: score >= ADAPTIVE_LEARNING_MASTERY_THRESHOLD,
    completedAt: lastLogin,
  }));

  const certificatesEarned = assessmentResults
    .filter((result) => result.mastered)
    .map((result) => `${track}-${result.level}-CERTIFICATE`);

  const trackLessons = curriculumCatalog.filter((lesson) => lesson.track === track);
  const masteredLevelIndex = LEVEL_CODES.indexOf(fixture.level);
  const lessonsCompleted = trackLessons
    .filter((lesson) => LEVEL_CODES.indexOf(lesson.level) < masteredLevelIndex)
    .map((lesson) => lesson.id);
  const timeCompleted = Object.fromEntries(lessonsCompleted.map((lessonId) => [lessonId, lastLogin]));
  const unlockedLessons = trackLessons
    .filter((lesson) => isLessonUnlocked(lesson, trackLessons, lessonsCompleted, assessmentScores))
    .map((lesson) => lesson.id);
  const nextLesson = trackLessons.find((lesson) => unlockedLessons.includes(lesson.id) && !lessonsCompleted.includes(lesson.id)) ?? null;
  const currentLesson = nextLesson?.id ?? null;

  return {
    currentLevel: fixture.level,
    currentLesson,
    lessonsCompleted,
    assessmentScores,
    assessmentResults,
    timeCompleted,
    completionPercentage: calculateCompletionPercentage(trackLessons, lessonsCompleted, masteredLevelIndex),
    certificatesEarned,
    lastLogin,
    competencyColor: track,
    competencyLevel: fixture.level,
    nextLesson,
    assessmentStatus: buildAssessmentStatus(fixture.level, fixture.focusScore),
    unlockedLessons,
  };
}

function buildDashboardWidgets(
  studentProgress: StudentProgressDatabaseRecord,
  recommendedTrack: AdaptiveTrackCode,
): AdaptiveLearningDashboardWidget[] {
  const selectedTrack = studentProgress.tracks[recommendedTrack];

  return [
    {
      id: "current-level",
      label: "Current Level",
      value: selectedTrack.currentLevel,
    },
    {
      id: "current-color",
      label: "Current Color",
      value: `${recommendedTrack} • ${NORTH_AMERICA_TRACKS[recommendedTrack]}`,
    },
    {
      id: "next-lesson",
      label: "Next Lesson",
      value: selectedTrack.nextLesson?.id ?? "Awaiting curriculum upload",
    },
    {
      id: "assessment-status",
      label: "Assessment Status",
      value: selectedTrack.assessmentStatus,
    },
    {
      id: "completion",
      label: "Completion %",
      value: `${studentProgress.completionPercentage}%`,
    },
    {
      id: "certificates",
      label: "Certificates",
      value: String(studentProgress.certificatesEarned.length),
    },
  ];
}

function getRecommendedTrack(
  tracks: Record<AdaptiveTrackCode, StudentTrackProgressRecord>,
): AdaptiveTrackCode {
  return [...TRACK_ORDER].sort((left, right) => {
    const leftScore = latestAssessmentScore(tracks[left]);
    const rightScore = latestAssessmentScore(tracks[right]);

    if (leftScore !== rightScore) {
      return leftScore - rightScore;
    }

    return tracks[left].completionPercentage - tracks[right].completionPercentage;
  })[0];
}

function latestAssessmentScore(track: StudentTrackProgressRecord) {
  return track.assessmentResults.at(-1)?.score ?? 0;
}

function isLessonUnlocked(
  lesson: AdaptiveLessonRecord,
  trackLessons: AdaptiveLessonRecord[],
  lessonsCompleted: string[],
  assessmentScores: Record<AdaptiveLevelCode, number | null>,
) {
  const lessonIndex = trackLessons.findIndex((entry) => entry.id === lesson.id);
  if (lessonIndex <= 0) {
    return true;
  }

  const previousLesson = trackLessons[lessonIndex - 1];
  if (!lessonsCompleted.includes(previousLesson.id)) {
    return false;
  }

  if (previousLesson.level !== lesson.level) {
    const score = assessmentScores[previousLesson.level] ?? 0;
    return score >= ADAPTIVE_LEARNING_MASTERY_THRESHOLD;
  }

  return true;
}

function calculateCompletionPercentage(
  trackLessons: AdaptiveLessonRecord[],
  lessonsCompleted: string[],
  masteredLevelIndex: number,
) {
  if (trackLessons.length > 0) {
    return Math.round((lessonsCompleted.length / trackLessons.length) * 100);
  }

  return Math.round(((masteredLevelIndex + 1) / LEVEL_CODES.length) * 100);
}

function buildAssessmentStatus(level: AdaptiveLevelCode, score: number) {
  const statusLabel = score >= ADAPTIVE_LEARNING_MASTERY_THRESHOLD ? "Mastered" : "Needs Mastery";
  return `${statusLabel} ${level} • ${score}%`;
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function isAdaptiveTrackCode(track: string): track is AdaptiveTrackCode {
  return track in NORTH_AMERICA_TRACKS;
}

function resolveMasteryThreshold(rawValue: string | undefined) {
  const parsedValue = Number.parseInt(rawValue ?? "80", 10);

  if (Number.isNaN(parsedValue)) {
    return 80;
  }

  return Math.min(100, Math.max(1, parsedValue));
}
