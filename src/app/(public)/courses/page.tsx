import CoursesPageClient from "./CoursesPageClient";
import { getPublishedCourses } from "@/lib/curriculum/authoritative-published";

export const metadata = {
  title: "Courses | Edunancial",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getPublishedCourses("en");
  return <CoursesPageClient courses={courses} />;
}
