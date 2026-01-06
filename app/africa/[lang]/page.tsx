import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import {
  REGION_LANGUAGES,
  isLanguage,
  type Language,
  type Region
} from "@/lib/i18n";

type Props = {
  params: { lang: string };
};

const REGION: Region = "africa";

export default function AfricaPage({ params }: Props) {
  const raw = params.lang;

  if (!isLanguage(raw, REGION)) {
    return notFound();
  }

  const lang: Language = raw;

  if (!REGION_LANGUAGES[REGION].includes(lang)) {
    return notFound();
  }

  return <RegionCurriculum region={REGION} lang={lang} />;
}
