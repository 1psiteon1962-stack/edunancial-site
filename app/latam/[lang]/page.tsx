// app/latam/[lang]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";

const SUPPORTED_LANGUAGES = ["es", "en"] as const;
type Lang = (typeof SUPPORTED_LANGUAGES)[number];

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default function LatamPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang = params.lang as Lang;

  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  const isSpanish = lang === "es";

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      {/* Language Switch */}
      <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
        {isSpanish ? (
          <Link href="/latam/en">View in English</Link>
        ) : (
          <Link href="/latam/es">Ver en Español</Link>
        )}
      </div>

      {/* Page Content */}
      <h1>
        {isSpanish
          ? "Edunancial — América Latina"
          : "Edunancial — Latin America"}
      </h1>

      <p>
        {isSpanish
          ? "Esta versión regional está diseñada para economías con alta informalidad, fricción regulatoria y acceso limitado a capital estructurado."
          : "This regional version is designed for economies with high informality, regulatory friction, and limited access to structured capital."}
      </p>

      <p>
        {isSpanish
          ? "El enfoque no es teoría académica, sino comprensión práctica de estructura empresarial, riesgo legal, flujos de efectivo y crecimiento sostenible."
          : "The focus is not academic theory, but practical understanding of business structure, legal risk, cash flow, and sustainable growth."}
      </p>

      <p>
        {isSpanish
          ? "Edunancial proporciona marcos de análisis — no asesoría legal, financiera ni de inversión."
          : "Edunancial provides analytical frameworks — not legal, financial, or investment advice."}
      </p>

      <p>
        {isSpanish
          ? "Idioma actual:"
          : "Current language:"}{" "}
        <strong>{lang.toUpperCase()}</strong>
      </p>

      {/* Footer */}
      <footer style={{ marginTop: "4rem", fontSize: "0.85rem", opacity: 0.7 }}>
        <p>
          {isSpanish
            ? "Propiedad intelectual de Caban International Holdings, Inc. Licenciada para uso regional."
            : "Intellectual property of Caban International Holdings, Inc. Licensed for regional use."}
        </p>
      </footer>
    </main>
  );
}
