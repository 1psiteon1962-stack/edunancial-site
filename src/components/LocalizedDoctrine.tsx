// src/components/LocalizedDoctrine.tsx

import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type Props = {
  lang: Language;
};

export default function LocalizedDoctrine({ lang }: Props) {
  return (
    <section>
      <h2>{t(lang, "doctrine_title")}</h2>
      <p>{t(lang, "doctrine_body")}</p>
    </section>
  );
}
