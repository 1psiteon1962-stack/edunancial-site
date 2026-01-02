import { REGIONS } from "@/data/regions";
import { EUROPE_CURRICULUM } from "@/data/curriculum/europe";
import CurriculumPage from "@/components/CurriculumPage";

export default function EuropePage({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  const content = EUROPE_CURRICULUM[lang] ?? EUROPE_CURRICULUM.en;

  return (
    <CurriculumPage
      headline={content.headline}
      levels={content.levels}
      currency={REGIONS.europe.currency}
    />
  );
}
