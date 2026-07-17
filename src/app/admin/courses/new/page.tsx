import { requireAdminPageSession } from "@/lib/admin-content/auth";
import CourseFormClient from "@/components/admin-content/CourseFormClient";

export const metadata = { title: "New Course | Edunancial Admin" };

export default async function NewCoursePage() {
  await requireAdminPageSession();
  return <CourseFormClient mode="create" />;
}
