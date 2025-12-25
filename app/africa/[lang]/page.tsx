import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * REQUIRED for Next.js static export
 * Enumerate every language that may exist at build time
 */
export function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "fr" },
    { lang: "ar" },
  ];
}

export default function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;

  if (!["en", "fr", "ar"].includes(lang)) {
    notFound();
  }

  const content =
    lang === "fr"
      ? {
          title: "Edunancial — Afrique",
          subtitle:
            "Structure, stabilité et systèmes pratiques pour des économies en croissance.",
          body:
            "Nous nous concentrons sur la clarté financière, la réduction des risques et la construction de systèmes reproductibles dans des environnements en évolution.",
        }
      : lang === "ar"
      ? {
          title: "Edunancial — أفريقيا",
          subtitle:
            "الهياكل والانضباط والأنظمة العملية للنمو في الأسواق المتغيرة.",
          body:
            "نركز على وضوح رأس المال وتقليل المخاطر وبناء أنظمة قابلة للتوسع.",
        }
      : {
          title: "Edunancial — Africa",
          subtitle:
            "Structure, stability, and practical systems for emerging markets.",
          body:
            "We focus on capital clarity, risk reduction, and repeatable systems that scale across changing economic environments.",
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
        <Link href="/africa/en">EN</Link>{" | "}
        <Link href="/africa/fr">FR</Link>{" | "}
        <Link href="/africa/ar">AR</Link>
      </div>

      <h1>{content.title}</h1>
      <h3>{content.subtitle}</h3>

      <p>{content.body}</p>
    </main>
  );
}
