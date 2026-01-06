import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { REGION_LANGUAGES, isLanguage, type Language } from "@/lib/i18n";

type Props = { params: { lang: string } };

export default function MenaPage({ params }: Props) {
  const raw = params.lang;

  if (!isLanguage(raw)) return notFound();

  const lang: Language = raw;
  if (!REGION_LANGUAGES.mena.includes(lang)) return notFound();

  return <RegionCurriculum regionKey="mena" lang={lang} />;
}
