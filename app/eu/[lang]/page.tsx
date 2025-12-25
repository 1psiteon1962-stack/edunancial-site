import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * Required for static export
 */
export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export default function Page({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;

  if (!["en", "fr"].includes(lang)) {
    notFound();
  }

  const content = {
    en: {
      title: "Edunancial — Europe",
      subtitle:
        "Capital structure, governance, and scalable systems.",
      body:
        "Edunancial focuses on durability, compliance awareness, and cross-border capital logic.",
    },
    fr: {
      title: "Edunancial — Europe",
      subtitle:
        "Structure du capital, gouvernance et systèmes évolutifs.",
      body:
        "Edunancial se concentre sur la durabilité, la conformité et la logique du capital transfrontalier.",
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
        <Link href="/eu/en">EN</Link> |{" "}
        <Link href="/eu/fr">FR</Link>
      </div>

      <h1>{content.title}</h1>
      <h3>{content.subtitle}</h3>

      <p>{content.body}</p>
    </main>
  );
}
