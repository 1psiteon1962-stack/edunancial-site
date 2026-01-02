import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { isLanguage, type Language } from "@/lib/languages";

type PageProps = { params: { lang: string } };

export default function Page({ params }: PageProps) {
  if (!isLanguage(params.lang)) return notFound();
  const lang: Language = params.lang;

  return <RegionCurriculum regionKey="africa" lang={lang} />;
}
