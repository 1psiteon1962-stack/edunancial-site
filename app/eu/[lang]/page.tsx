import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { Language, REGION_LANGUAGES } from "@/lib/i18n";

type Props = { params: { lang: string } };

export default function EuropePage({ params }: Props) {
  if (!REGION_LANGUAGES.europe.includes(params.lang as Language)) notFound();

  return <RegionCurriculum regionKey="europe" lang={params.lang as Language} />;
}

export function generateStaticParams() {
  return REGION_LANGUAGES.europe.map((lang) => ({ lang }));
}
