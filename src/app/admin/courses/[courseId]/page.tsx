import { notFound } from "next/navigation";

import { requireAdminPageSession } from "@/lib/admin-content/auth";
import CourseEditorClient from "@/components/admin-content/CourseEditorClient";
import { getCourse } from "@/lib/admin-content/course-storage";

export const metadata = { title: "Edit Course | Edunancial Admin" };

export default async function CourseEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  await requireAdminPageSession();

  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) notFound();

  return <CourseEditorClient initialCourse={course} />;
}
