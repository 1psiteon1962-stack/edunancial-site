import { notFound } from "next/navigation";
import RegionCurriculum from "@/components/RegionCurriculum";
import { isLanguage, Language } from "@/lib/language";

export default function Page({ params }: { params: { lang: string } }) {
  if (!isLanguage(params.lang)) notFound();

  return (
    <RegionCurriculum
      regionKey="asia"
      lang={params.lang as Language}
    />
  );
}
