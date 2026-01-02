import { Region, Language } from "@/lib/language";
import { RegionCurriculumContent } from "@/lib/regionContent";

type Props = {
  regionKey: Region;
  lang: Language;
  content: RegionCurriculumContent;
};

export default function RegionCurriculum({
  regionKey,
  lang,
  content,
}: Props) {
  return (
    <main>
      <h1>{content.heroTitle}</h1>
      <p>{content.description}</p>

      <ul>
        {content.curriculum.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p>
        Pricing: {content.pricing.currency} {content.pricing.amount}
      </p>
    </main>
  );
}
