// components/RegionCurriculum.tsx

import { Language, Region, DEFAULT_LANGUAGE_BY_REGION } from "@/lib/language";

export default function RegionCurriculum({
  regionKey,
  lang
}: {
  regionKey: Region;
  lang: Language;
}) {
  const fallbackLang = DEFAULT_LANGUAGE_BY_REGION[regionKey];

  return (
    <main>
      <h1>{regionKey.toUpperCase()} Curriculum</h1>
      <p>Language: {lang || fallbackLang}</p>
    </main>
  );
}
