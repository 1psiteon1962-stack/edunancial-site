import { ACADEMIES } from "@/lib/curriculum/academies";

const BASE_CURRICULUM_PATHS = [
  "/curriculum",
  "/courses",
  "/course-catalog",
  "/my-courses",
  "/course-progress",
  "/search",
];

function curriculumPathsForTrack(trackCode?: string) {
  if (!trackCode) {
    const derived = ACADEMIES.flatMap((academy) => {
      const track = academy.code.toLowerCase();
      return [
        `/curriculum/${track}`,
        `/courses/${track}`,
        ...Array.from(
          { length: academy.levelCount },
          (_, index) => `/curriculum/${track}/l${index + 1}`,
        ),
      ];
    });
    return [...new Set([...BASE_CURRICULUM_PATHS, ...derived])];
  }

  const normalized = trackCode.trim().toLowerCase();
  const academy = ACADEMIES.find(
    (candidate) => candidate.code.toLowerCase() === normalized,
  );
  if (!academy) return BASE_CURRICULUM_PATHS;

  return [
    ...BASE_CURRICULUM_PATHS,
    `/curriculum/${normalized}`,
    `/courses/${normalized}`,
    ...Array.from(
      { length: academy.levelCount },
      (_, index) => `/curriculum/${normalized}/l${index + 1}`,
    ),
  ];
}

/**
 * Revalidate curriculum pages after publication. Upload finalization should pass
 * the affected track so a BLACK translation, for example, does not synchronously
 * invalidate every level of every academy before the HTTP request can return.
 */
export async function revalidatePublishedCurriculumRoutes(
  trackCode?: string,
): Promise<void> {
  try {
    const importer = new Function(
      "moduleName",
      "return import(moduleName)",
    ) as (moduleName: string) => Promise<any>;
    const cache = await importer("next/cache");
    for (const path of curriculumPathsForTrack(trackCode)) {
      cache.revalidatePath(path);
    }
    cache.revalidateTag("curriculum-published");
  } catch {
    // no-op in non-Next/test environments
  }
}
