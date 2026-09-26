export const CURRICULUM_TRACKS = ["RED","WHITE","BLUE","GREEN","GOLD","PURPLE","ORANGE","BLACK"] as const;
export const CURRICULUM_LEVELS = [1,2,3,4,5] as const;
export const CURRICULUM_QUALITY_STATUSES = [
  "canonical","machine-validated","reviewed","stale","template","placeholder","missing",
] as const;

export type CurriculumTrack = typeof CURRICULUM_TRACKS[number];
export type CurriculumLevel = typeof CURRICULUM_LEVELS[number];
export type CurriculumQualityStatus = typeof CURRICULUM_QUALITY_STATUSES[number];

export interface NormalizedLessonRecord {
  id: string;
  track: CurriculumTrack;
  level: CurriculumLevel;
  lesson: number;
  locale: string;
  title: string;
  summary: string;
  body: string;
  status: CurriculumQualityStatus;
  sourceHash: string;
  origin: string;
}

export function curriculumLessonId(track: CurriculumTrack, level: CurriculumLevel, lesson: number): string {
  if (!Number.isInteger(lesson) || lesson < 1 || lesson > 50) throw new Error("lesson must be 1-50");
  return `${track}-L${level}-${String(lesson).padStart(3,"0")}`;
}
