import { Language } from "@/lib/language";
import { regionCurriculumContent } from "@/lib/regionCurriculumContent";

export type RegionCurriculumContent = {
  heroTitle: string;
  description: string;
};

type Props = {
  regionKey: string;
  lang: Language;
};

export default function RegionCurriculum({ regionKey, lang }: Props) {
  const region = regionCurriculumContent[regionKey];

  if (!region) {
    return null;
  }

  const content = region[lang] ?? region["en"];

  return (
    <main>
      <h1>{content.heroTitle}</h1>
      <p>{content.description}</p>
    </main>
  );
}
