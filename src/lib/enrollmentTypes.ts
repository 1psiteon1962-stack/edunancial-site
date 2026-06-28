export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  status: "active" | "completed" | "cancelled";
  progressPercent: number;
}
