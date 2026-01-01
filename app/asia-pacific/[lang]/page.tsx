import { REGION_LANGUAGES, Language } from "@/lib/i18n";
import LocalizedDoctrine from "@/components/LocalizedDoctrine";
import CurriculumPath from "@/components/CurriculumPath";
import CapitalismAssessment from "@/components/CapitalismAssessment";

export function generateStaticParams() {
  return REGION_LANGUAGES["asia-pacific"].map(lang => ({ lang }));
}

export default function AsiaPacificPage({
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
