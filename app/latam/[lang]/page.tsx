import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * REQUIRED for output: 'export'
 */
export function generateStaticParams() {
  return [
    { lang: "es" },
    { lang: "en" },
  ];
}

export default function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;

  if (!["es", "en"].includes(lang)) {
    notFound();
  }

  const content =
    lang === "es"
      ? {
          title: "Edunancial — América Latina",
          subtitle:
            "Estructura financiera, disciplina y crecimiento sostenible.",
          body:
            "Apoyamos a emprendedores y empresas en América Latina con modelos financieros claros, gobernanza sólida y expansión responsable.",
        }
      : {
          title: "Edunancial — Latin America",
          subtitle:
            "Financial structure, discipline, and sustainable growth.",
          body:
            "We support entrepreneurs and businesses across Latin America with clear financial models, governance, and responsible expansion.",
        };

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      {/* Language Toggle */}
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/latam/es">ES</Link>{" | "}
        <Link href="/latam/en">EN</Link>
      </div>

      <h1>{content.title}</h1>
      <h3>{content.subtitle}</h3>

      <p>{content.body}</p>
    </main>
  );
}
