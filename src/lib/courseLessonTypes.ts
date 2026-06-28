export type LessonType =
  | "video"
  | "youtube"
  | "live"
  | "pdf"
  | "audio"
  | "quiz"
  | "exam";

export interface CourseLesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: LessonType;
  order: number;
  language: string;
  region: string;
  contentUrl?: string;
  youtubeUrl?: string;
  scheduledFor?: string;
  isPublished: boolean;
  requiresPayment: boolean;
}
