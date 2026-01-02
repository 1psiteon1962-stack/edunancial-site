// components/RegionCurriculum.tsx

import { REGIONS, RegionKey } from "@/data/regions";

export default function RegionCurriculum({
  regionKey,
  lang,
}: {
  regionKey: RegionKey;
  lang: string;
}) {
  const region = REGIONS[regionKey];

  return (
    <section>
      <h1>{region.region}</h1>

      {region.tiers.map((tier) => {
        const content = (tier as any)[lang] || (tier as any)[region.defaultLanguage];

        return (
          <div key={tier.id}>
            <h2>{content.title}</h2>
            <p>{content.description}</p>

            <ul>
              {content.modules.map((m: string) => (
                <li key={m}>{m}</li>
              ))}
            </ul>

            <p>
              ${tier.price.monthly}/month or ${tier.price.annual}/year
            </p>

            <button>{content.cta}</button>
          </div>
        );
      })}
    </section>
  );
}
