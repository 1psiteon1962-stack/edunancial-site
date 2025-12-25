import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * REQUIRED for Netlify static export
 */
export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

export default function Page({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;

  if (!["es", "en"].includes(lang)) {
    notFound();
  }

  const content = {
    es: {
      title: "Edunancial — América Latina",
      subtitle:
        "Estructura financiera, sistemas prácticos y disciplina de capital.",
      body:
        "Edunancial no es teoría. Es un marco operativo diseñado para realidades económicas variables.",
    },
    en: {
      title: "Edunancial — Latin America",
      subtitle:
        "Financial structure, practical systems, and capital discipline.",
      body:
        "Edunancial is not theory. It is an operating framework designed for uneven economic conditions.",
    },
  }[lang];

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      {/* Language Switch */}
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <Link href="/latam/es">ES</Link> |{" "}
        <Link href="/latam/en">EN</Link>
      </div>

      <h1>{content.title}</h1>
      <h3>{content.subtitle}</h3>

      <p>{content.body}</p>
    </main>
  );
}
