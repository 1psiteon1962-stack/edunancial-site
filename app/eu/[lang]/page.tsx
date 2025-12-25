import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * REQUIRED for Next.js static export
 * Enumerate all languages at build time
 */
export function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "fr" },
    { lang: "de" },
  ];
}

export default function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;

  if (!["en", "fr", "de"].includes(lang)) {
    notFound();
  }

  const content =
    lang === "fr"
      ? {
          title: "Edunancial — Europe",
          subtitle:
            "Structure du capital, discipline et continuité à long terme.",
          body:
            "Nous mettons l’accent sur la stabilité financière, la gouvernance et des systèmes durables dans les marchés européens.",
        }
      : lang === "de"
      ? {
          title: "Edunancial — Europa",
          subtitle:
            "Kapitalstruktur, Disziplin und langfristige Stabilität.",
          body:
            "Fokus auf solide Finanzsysteme, Governance und nachhaltige Marktstrukturen.",
        }
      : {
          title: "Edunancial — Europe",
          subtitle:
            "Capital structure, discipline, and long-term continuity.",
          body:
            "We focus on financial stability, governance, and durable systems across European markets.",
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
        <Link href="/eu/en">EN</Link>{" | "}
        <Link href="/eu/fr">FR</Link>{" | "}
        <Link href="/eu/de">DE</Link>
      </div>

      <h1>{content.title}</h1>
      <h3>{content.subtitle}</h3>

      <p>{content.body}</p>
    </main>
  );
}
