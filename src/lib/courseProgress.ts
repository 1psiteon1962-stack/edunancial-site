export interface CourseProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  lastLessonId?: string;
  updatedAt: string;
}

const KEY = "edunancial-course-progress";

export function getCourseProgress(): CourseProgress[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCourseProgress(progress: Course
