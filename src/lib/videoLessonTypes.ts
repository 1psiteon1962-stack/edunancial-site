export type VideoLessonSource =
  | "youtube"
  | "uploaded"
  | "live"
  | "scheduled";

export interface VideoLesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  source: VideoLessonSource;
  url: string;
  thumbnailUrl?: string;
  durationMinutes?: number;
  releaseDate?: string;
  isPremium: boolean;
  isPublished: boolean;
}
