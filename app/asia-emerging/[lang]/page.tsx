// app/asia-emerging/[lang]/page.tsx

import { REGION_LANGUAGES, Language } from "@/lib/i18n";
import LocalizedDoctrine from "@/components/LocalizedDoctrine";
import CurriculumPath from "@/components/CurriculumPath";
import CapitalismAssessment from "@/components/CapitalismAssessment";

export function generateStaticParams() {
  return REGION_LANGUAGES["asia-emerging"].map((lang) => ({ lang }));
}

export default function AsiaEmergingPage({
  params,
}: {
  params: { lang: Language };
}) {
  return (
    <>
      <LocalizedDoctrine lang={params.lang} />
      <CurriculumPath />
      <CapitalismAssessment />
    </>
  );
}
