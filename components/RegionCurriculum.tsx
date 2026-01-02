// components/RegionCurriculum.tsx

import { regionContent } from "@/lib/regionContent";
import {
  Language,
  Region,
  DEFAULT_LANGUAGE_BY_REGION,
} from "@/lib/language";

type Props = {
  regionKey: Region;
  lang: Language;
};

export default function RegionCurriculum({ regionKey, lang }: Props) {
  const region = regionContent[regionKey];
  const fallbackLang = DEFAULT_LANGUAGE_BY_REGION[regionKey];

  const content = region[lang] ?? region[fallbackLang];

  if (!content) {
    return <div>Content coming soon.</div>;
  }

  return (
    <section>
      <h1>{content.heroTitle}</h1>
      <p>{content.description}</p>
      <ul>
        {content.curriculum.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>
        Price: {content.pricing.amount} {content.pricing.currency}
      </p>
    </section>
  );
}
