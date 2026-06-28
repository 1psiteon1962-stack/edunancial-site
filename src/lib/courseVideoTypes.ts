export type CourseVideoSource =
  | "youtube"
  | "upload"
  | "live"
  | "scheduled";

export interface CourseVideo {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  description: string;
  source: CourseVideoSource;
  youtubeUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationMinutes?: number;
  language: string;
  region: string;
  releaseDate?: string;
  isPublished: boolean;
  isPremium: boolean;
}
