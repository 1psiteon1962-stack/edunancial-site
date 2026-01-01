import GlobalLayout from "@/components/GlobalLayout";
import CurriculumPath from "@/components/CurriculumPath";
import CapitalismAssessment from "@/components/CapitalismAssessment";

/**
 * MENA Region Page
 * Route examples:
 * /mena/en
 * /mena/es
 */

export default function MENAPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;

  const isSpanish = lang === "es";

  return (
    <GlobalLayout>
      <section className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* ===== HERO ===== */}
        <header className="space-y-4">
          <h1 className="text-3xl font-bold">
            {isSpanish
              ? "Medio Oriente y Norte de África (MENA)"
              : "Middle East & North Africa (MENA)"}
          </h1>

          <p className="text-lg text-gray-700">
            {isSpanish
              ? "La región MENA combina capital energético, comercio estratégico y sistemas financieros en rápida modernización. La educación empresarial aquí requiere claridad estructural, cumplimiento y control del riesgo."
              : "The MENA region blends energy capital, strategic trade routes, and rapidly modernizing financial systems. Entrepreneurial education here demands structural clarity, compliance, and risk control."}
          </p>
        </header>

        {/* ===== CONTEXT ===== */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {isSpanish ? "Contexto Regional" : "Regional Context"}
          </h2>

          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              {isSpanish
                ? "Alta concentración de capital institucional y familiar"
                : "High concentration of institutional and family capital"}
            </li>
            <li>
              {isSpanish
                ? "Énfasis en estructuras legales claras y gobernanza"
                : "Strong emphasis on clear legal structures and governance"}
            </li>
            <li>
              {isSpanish
                ? "Creciente adopción de fintech y mercados digitales"
                : "Growing adoption of fintech and digital markets"}
            </li>
            <li>
              {isSpanish
                ? "Importancia crítica del cumplimiento regulatorio"
                : "Critical importance of regulatory compliance"}
            </li>
          </ul>
        </section>

        {/* ===== CURRICULUM PATH ===== */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {isSpanish
              ? "Ruta Educativa Recomendada"
              : "Recommended Learning Path"}
          </h2>

          <CurriculumPath
            region="mena"
            lang={lang}
          />
        </section>

        {/* ===== ASSESSMENT ===== */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {isSpanish
              ? "Evaluación de Enfoque Económico"
              : "Economic Mindset Assessment"}
          </h2>

          <p className="text-gray-700">
            {isSpanish
              ? "Esta evaluación ayuda a identificar tu posición actual dentro de sistemas de mercado estructurados y regulados."
              : "This assessment helps identify your current position within structured and regulated market systems."}
          </p>

          <CapitalismAssessment />
        </section>

        {/* ===== CTA ===== */}
        <section className="border-t pt-8">
          <p className="text-sm text-gray-600">
            {isSpanish
              ? "Edunancial proporciona educación. No ofrece asesoría legal, financiera ni de inversión."
              : "Edunancial provides education only. It does not offer legal, financial, or investment advice."}
          </p>
        </section>
      </section>
    </GlobalLayout>
  );
}
