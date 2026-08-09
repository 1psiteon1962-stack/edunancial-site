import CoursesPageClient from "./CoursesPageClient";
import { cookies } from "next/headers";
import { getPublishedCourses } from "@/lib/curriculum/authoritative-published";
import { normalizeLanguageCode } from "@/lib/international/languages";
import { LANGUAGE_COOKIE_NAME } from "@/lib/international/preferences";

export const metadata = {
  title: "Courses | Edunancial",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const cookieStore = await cookies();
  const language = normalizeLanguageCode(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value ?? "en-US");
  const courses = await getPublishedCourses(language);
  return <CoursesPageClient courses={courses} />;
}
