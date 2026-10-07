import { exportPublishedLessonTranslations } from "@/lib/curriculum/authoritative-published";

export type RestorationPostPublicationVerification = {
  reconciliationKey: string;
  expectedLessonCount: 50;
  resolvedLessonCount: number;
  complete: boolean;
  missingLessonIds: string[];
};

export async function verifyRestoredCanonicalCoordinate(
  reconciliationKey: string,
): Promise<RestorationPostPublicationVerification> {
  const match = reconciliationKey.match(/^([A-Z]+):L([1-5]):(?:en|en-US)$/u);
  if (!match) {
    return { reconciliationKey, expectedLessonCount: 50, resolvedLessonCount: 0, complete: false, missingLessonIds: [] };
  }

  const track = match[1]!;
  const level = match[2]!;
  const expected = Array.from({ length: 50 }, (_, index) =>
    `${track}-L${level}-${String(index + 1).padStart(3, "0")}`,
  );
  const rows = await exportPublishedLessonTranslations({ lessonIds: expected });
  const resolved = new Set(rows.filter((row) => row.title !== null && row.body !== null).map((row) => row.id));
  const missingLessonIds = expected.filter((id) => !resolved.has(id));

  return {
    reconciliationKey,
    expectedLessonCount: 50,
    resolvedLessonCount: resolved.size,
    complete: missingLessonIds.length === 0,
    missingLessonIds,
  };
}
