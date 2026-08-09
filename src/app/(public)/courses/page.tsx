import CoursesPageClient from "./CoursesPageClient";
import { getPublishedCourses } from "@/lib/curriculum/authoritative-published";
import { getServerLanguage } from "@/lib/international/server";

export const metadata = {
  title: "Courses | Edunancial",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const language = await getServerLanguage();
  const courses = await getPublishedCourses(language);
  return <CoursesPageClient courses={courses} />;
}
