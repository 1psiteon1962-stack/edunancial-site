// app/latam/[lang]/page.tsx

import { notFound } from "next/navigation";
import { Language, REGION_LANGUAGES, isLanguage } from "@/lib/i18n";
import RegionCurriculum from "@/components/RegionCurriculum";

type Props = {
  params: {
    lang: string;
  };
};

export default function LatAmPage({ params }: Props) {
  const { lang } = params;

  // Validate language shape
  if (!isLanguage(lang)) {
    notFound();
  }

  // Validate language allowed for LATAM
  if (!REGION_LANGUAGES.latam.includes(lang)) {
    notFound();
  }

  return (
    <RegionCurriculum
      regionKey="latam"
      lang={lang as Language}
    />
  );
}
