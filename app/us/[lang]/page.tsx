import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { Language, REGION_LANGUAGES } from "@/lib/i18n";

type Props = { params: { lang: string } };

export default function USPage({ params }: Props) {
  if (!REGION_LANGUAGES.us.includes(params.lang as Language)) notFound();

  return <RegionCurriculum regionKey="us" lang={params.lang as Language} />;
}

export function generateStaticParams() {
  return REGION_LANGUAGES.us.map((lang) => ({ lang }));
}
