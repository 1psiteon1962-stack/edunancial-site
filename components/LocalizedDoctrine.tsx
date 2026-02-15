import React from "react";
import { t } from "@/lib/i18n";

type Language = "en" | "es" | "fr" | "pt";

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
