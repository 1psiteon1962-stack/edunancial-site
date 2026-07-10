import type { PointsEventType } from "./types";

// ─── Points Configuration ─────────────────────────────────────────────────────
//
// Centralised configuration for point values.
// To modify point values, update the `value` field here — no other changes needed.

export interface PointsConfigEntry {
  type: PointsEventType;
  label: string;
  value: number;
  /** Description shown in the UI. */
  description: string;
  /** Whether this event type is active (false = future-ready placeholder). */
  active: boolean;
}

export const POINTS_CONFIG: PointsConfigEntry[] = [
  {
    type: "daily_login",
    label: "Daily Login",
    value: 5,
    description: "Earn points every day you log in.",
    active: true,
  },
  {
    type: "lesson_complete",
    label: "Lesson Completion",
    value: 20,
    description: "Earn points for each lesson you complete.",
    active: true,
  },
  {
    type: "quiz_complete",
    label: "Quiz Completion",
    value: 30,
    description: "Earn points for completing a quiz.",
    active: true,
  },
  {
    type: "calculator_use",
    label: "Calculator Usage",
    value: 10,
    description: "Earn points for using a financial calculator.",
    active: true,
  },
  {
    type: "course_complete",
    label: "Course Completion",
    value: 150,
    description: "Earn points for completing an entire course.",
    active: true,
  },
  {
    type: "certificate_earned",
    label: "Certificate Earned",
    value: 200,
    description: "Earn points when you receive a certificate.",
    active: true,
  },
  {
    type: "community_participation",
    label: "Community Participation",
    value: 15,
    description: "Earn points for engaging with the community (coming soon).",
    active: false, // future-ready placeholder
  },
];

/** Look up the configured point value for a given event type. Returns 0 if not found or inactive. */
export function getPointValue(type: PointsEventType): number {
  const entry = POINTS_CONFIG.find((c) => c.type === type && c.active);
  return entry?.value ?? 0;
}
