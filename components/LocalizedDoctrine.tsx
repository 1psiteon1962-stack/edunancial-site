// components/LocalizedDoctrine.tsx

import React from "react";
import { isLanguage, t, type Language } from "@/lib/i18n";

type Props = {
  lang: string;
};

export default function LocalizedDoctrine({ lang }: Props) {
  // Runtime + TypeScript safe conversion
  const safeLang: Language = isLanguage(lang) ? lang : "en";

  return (
    <section style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 12 }}>
        {t(safeLang, "doctrine_title")}
      </h2>

      <p style={{ lineHeight: 1.6 }}>
        {t(safeLang, "doctrine_body")}
      </p>
    </section>
  );
}
