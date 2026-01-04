// components/RegionCurriculum.tsx

import React from "react";
import { regionCurriculumContent } from "@/lib/regionCurriculumContent";
import type { Region } from "@/lib/regions";
import type { Language } from "@/lib/i18n";

type Props = {
  regionKey: Region;
  lang: Language;
};

export default function RegionCurriculum({ regionKey, lang }: Props) {
  const content = regionCurriculumContent[regionKey];

  if (!content) {
    return (
      <section>
        <h2>Content unavailable</h2>
        <p>This region does not yet have curriculum content.</p>
      </section>
    );
  }

  const localized = content[lang] ?? content.en;

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>{localized.title}</h2>
      <p>{localized.description}</p>

      <ul>
        {localized.tracks.map((track) => (
          <li key={track.id} style={{ marginBottom: "1rem" }}>
            <strong>{track.title}</strong>
            <p>{track.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
