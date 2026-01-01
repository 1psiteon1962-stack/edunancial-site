import { Language } from "@/lib/i18n";
import LocalizedDoctrine from "@/components/LocalizedDoctrine";
import CurriculumPath from "@/components/CurriculumPath";
import CapitalismAssessment from "@/components/CapitalismAssessment";

export default function AsiaPage({ params }: { params: { lang: Language } }) {
  return (
    <>
      <header className="py-10 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold">Asia</h1>
        <p className="mt-2 text-gray-600">
          Digital-first positioning in high-density, high-competition markets.
        </p>
      </header>

      <LocalizedDoctrine lang={params.lang} />
      <CurriculumPath />
      <CapitalismAssessment />
    </>
  );
}
