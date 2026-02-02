"use client";

import React from "react";
import { t } from "@/lib/i18n";

type Props = {
  lang: string;
};

export default function LocalizedDoctrine({ lang }: Props) {
  return (
    <section style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 12 }}>{t(lang, "doctrine_title")}</h2>
      <p style={{ lineHeight: 1.6 }}>{t(lang, "doctrine_body")}</p>
    </section>
  );
}
