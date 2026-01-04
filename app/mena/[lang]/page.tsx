import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { Language, REGION_LANGUAGES } from "@/lib/i18n";

type Props = {
  params: { lang: string };
};

export default function MenaPage({ params }: Props) {
  if (!REGION_LANGUAGES.mena.includes(params.lang as Language)) {
    notFound();
  }

  return (
    <RegionCurriculum
      regionKey="mena"
      lang={params.lang as Language}
    />
  );
}

export function generateStaticParams() {
  return REGION_LANGUAGES.mena.map((lang) => ({ lang }));
}
