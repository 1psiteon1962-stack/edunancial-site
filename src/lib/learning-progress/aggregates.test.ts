import assert from "node:assert/strict";
import test from "node:test";

import {
  buildOverallCompletionSummary,
  buildTrackProgressSummaries,
  chooseNextAccessibleUnfinishedLesson,
  countCompletedLessons,
  countStartedLessons,
  type CurriculumLessonSummary,
} from "./aggregates";
import type { UserLessonProgressRow } from "./types";

const lessons: CurriculumLessonSummary[] = [
  { lessonId: "RED-L1-001", courseId: "red", trackCode: "RED", levelCode: "L1", lessonNumber: 1 },
  { lessonId: "RED-L1-002", courseId: "red", trackCode: "RED", levelCode: "L1", lessonNumber: 2 },
  { lessonId: "WHITE-L1-001", courseId: "white", trackCode: "WHITE", levelCode: "L1", lessonNumber: 1 },
];

const baseRow: UserLessonProgressRow = {
  id: "1",
  user_id: "u1",
  course_id: "red",
  lesson_id: "RED-L1-001",
  track_code: "RED",
  level_code: "L1",
  lesson_number: 1,
  status: "completed",
  progress_percent: 100,
  seconds_watched: 60,
  last_position_seconds: 60,
  first_viewed_at: "2026-01-01T00:00:00.000Z",
  last_viewed_at: "2026-01-01T00:01:00.000Z",
  completed_at: "2026-01-01T00:01:00.000Z",
  access_tier_at_record: "basic",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:01:00.000Z",
};

test("count helpers classify started and completed lessons", () => {
  const rows: UserLessonProgressRow[] = [
    baseRow,
    {
      ...baseRow,
      id: "2",
      lesson_id: "RED-L1-002",
      status: "in_progress",
      progress_percent: 20,
      completed_at: null,
    },
  ];

  assert.equal(countCompletedLessons(rows), 1);
  assert.equal(countStartedLessons(rows), 2);
});

test("chooseNextAccessibleUnfinishedLesson returns first unfinished accessible lesson", () => {
  const row = baseRow;
  const next = chooseNextAccessibleUnfinishedLesson({
    lessons,
    progressRows: [row],
    tier: "basic",
    canAccess: () => true,
  });

  assert.equal(next?.lessonId, "RED-L1-002");
});

test("buildTrackProgressSummaries and overall summary compute percentages", () => {
  const summaries = buildTrackProgressSummaries({
    lessons,
    progressRows: [baseRow],
    tier: "basic",
    canAccess: () => true,
  });

  const red = summaries.find((item) => item.trackCode === "RED");
  const white = summaries.find((item) => item.trackCode === "WHITE");

  assert.equal(red?.lessonsCompleted, 1);
  assert.equal(red?.totalLessons, 2);
  assert.equal(red?.completionPercentage, 50);
  assert.equal(white?.lessonsCompleted, 0);

  const overall = buildOverallCompletionSummary(summaries);
  assert.equal(overall.totalLessons >= 3, true);
  assert.equal(overall.lessonsCompleted, 1);
});
