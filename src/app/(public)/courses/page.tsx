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
  // Send only what the catalog cards render. Passing full lesson bodies and
  // every translation to the client made this RSC payload ~1 MB and caused
  // "Connection closed" errors on slow responses.
  const cards = courses.map(({ lessons, ...course }) => ({ ...course, lessonCount: lessons.length }));
  return <CoursesPageClient courses={cards} />;
}
