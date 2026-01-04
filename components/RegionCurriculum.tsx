// components/RegionCurriculum.tsx

import { Language, Region } from "@/lib/i18n";
import { regionCurriculumContent } from "@/lib/regionCurriculumContent";

type Props = {
  regionKey: Region;
  lang: Language;
};

export default function RegionCurriculum({ regionKey, lang }: Props) {
  const region = regionCurriculumContent[regionKey];
  const localized = region?.[lang];

  if (!localized) return null;

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>{localized.title}</h2>
      <p>{localized.description}</p>
    </section>
  );
}
