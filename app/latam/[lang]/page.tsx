import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * REQUIRED for Next.js static export
 * Enumerate all languages at build time
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
    lang === "en"
      ? {
          title: "Edunancial — Latin America",
          subtitle:
            "Capital structure, stability, and practical systems in evolving economies.",
          body:
            "We focus on disciplined capital management, system design, and long-term resilience in dynamic regional markets.",
        }
      : {
          title: "Edunancial — América Latina",
          subtitle:
            "Estructura de capital, estabilidad y sistemas prácticos para economías en evolución.",
          body:
            "Nos enfocamos en disciplina financiera, diseño de sistemas y resiliencia a largo plazo en mercados regionales dinámicos.",
        };

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      {/* Language Switch */}
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
