// Pure, dependency-free classifier for the bodies learners receive (report-only audit signal).

export type ContentQuality = { servedLessons: number; distinctBodies: number; medianBodyChars: number; verdict: "OK" | "THIN" | "TEMPLATE" | "NONE" };
export const THIN_LESSON_MAX_CHARS = 1200;

/** Pure: classify the learner-served bodies of one coordinate. */
export function assessContentQuality(bodies: string[]): ContentQuality {
  if (!bodies.length) return { servedLessons: 0, distinctBodies: 0, medianBodyChars: 0, verdict: "NONE" };
  const normalized = bodies.map((body) => body.replace(/[A-Z]+-L\d-\d{3}/giu, "").replace(/\d+/gu, "#").replace(/\s+/gu, " ").trim());
  const distinctBodies = new Set(normalized).size;
  const lengths = bodies.map((body) => body.trim().length).sort((a, b) => a - b);
  const medianBodyChars = lengths[Math.floor(lengths.length / 2)]!;
  const verdict = bodies.length >= 5 && distinctBodies <= Math.max(1, Math.floor(bodies.length * 0.2)) ? "TEMPLATE" : medianBodyChars < THIN_LESSON_MAX_CHARS ? "THIN" : "OK";
  return { servedLessons: bodies.length, distinctBodies, medianBodyChars, verdict };
}
