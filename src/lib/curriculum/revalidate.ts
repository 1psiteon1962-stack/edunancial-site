import { ACADEMIES } from "@/lib/curriculum/academies";

function allCurriculumPaths() {
  const base = ["/curriculum", "/courses", "/course-catalog", "/my-courses", "/course-progress", "/search"];
  const derived = ACADEMIES.flatMap((academy) => {
    const track = academy.code.toLowerCase();
    return [
      `/curriculum/${track}`,
      `/courses/${track}`,
      ...Array.from({ length: academy.levelCount }, (_, index) => `/curriculum/${track}/l${index + 1}`),
    ];
  });
  return [...new Set([...base, ...derived])];
}

export async function revalidatePublishedCurriculumRoutes(): Promise<void> {
  try {
    const importer = new Function("moduleName", "return import(moduleName)") as (moduleName: string) => Promise<any>;
    const cache = await importer("next/cache");
    for (const path of allCurriculumPaths()) {
      cache.revalidatePath(path);
    }
    cache.revalidateTag("curriculum-published");
  } catch {
    // no-op in non-Next/test environments
  }
}
