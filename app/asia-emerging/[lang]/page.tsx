import { Language } from "@/lib/i18n";
import CurriculumPath from "@/components/CurriculumPath";
import CapitalismAssessment from "@/components/CapitalismAssessment";

export default function AsiaEmergingPage({ params }: { params: { lang: Language } }) {
  return (
    <>
      <header className="py-10 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold">Asia – Emerging Markets</h1>
        <p className="mt-2 text-gray-600">
          Early-stage capital literacy before consolidation accelerates.
        </p>
      </header>

      <CurriculumPath />
      <CapitalismAssessment />
    </>
  );
}
