// app/latam/[lang]/page.tsx

import { notFound } from "next/navigation";
import {
  resolveCopy,
  REGION_LANGUAGES,
  Language,
} from "@/lib/core";

type LatamLanguage = (typeof REGION_LANGUAGES)["LATAM"][number];

export default function Page({
  params,
}: {
  params: { lang: string };
}) {
  const lang = params.lang as Language;

  if (!REGION_LANGUAGES.LATAM.includes(lang)) {
    notFound();
  }

  const copy =
    resolveCopy("LATAM", lang as LatamLanguage) ??
    resolveCopy("LATAM", "es");

  if (!copy) {
    notFound();
  }

  return <main>{copy}</main>;
}
