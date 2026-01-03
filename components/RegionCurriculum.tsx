// components/RegionCurriculum.tsx

import { regionCurriculumContent } from "@/lib/regionCurriculumContent";
import type { RegionKey } from "@/lib/regions";
import type { Language } from "@/lib/i18n";

type Props = {
  regionKey: RegionKey;
  lang: Language;
};

export default function RegionCurriculum({ regionKey, lang }: Props) {
  const content =
    regionCurriculumContent[regionKey]?.[lang] ??
    regionCurriculumContent[regionKey]?.["en"];

  if (!content) {
    return null;
  }

  return (
    <section style={{ maxWidth: "720px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700 }}>
        {content.heroTitle}
      </h1>
      <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
        {content.description}
      </p>
    </section>
  );
}
