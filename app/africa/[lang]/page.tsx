import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * REQUIRED for output: 'export'
 * Do NOT remove
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
          dir: "ltr",
          title: "Edunancial — Afrique",
          subtitle:
            "Structure financière, discipline et croissance durable.",
          body:
            "Nous accompagnons les entrepreneurs et les entreprises africaines avec des cadres financiers solides, une gouvernance claire et des stratégies d’expansion responsables.",
        }
      : lang === "ar"
      ? {
          dir: "rtl",
          title: "إدونانشال — أفريقيا",
          subtitle:
            "الهيكلة المالية والانضباط والنمو المستدام.",
          body:
            "ندعم رواد الأعمال والشركات في أفريقيا من خلال نماذج مالية واضحة وحوكمة قوية وتوسع مسؤول.",
        }
      : {
          dir: "ltr",
          title: "Edunancial — Africa",
          subtitle:
            "Financial structure, discipline, and sustainable growth.",
          body:
            "We support entrepreneurs and businesses across Africa with clear financial models, strong governance, and responsible expansion strategies.",
        };

  return (
    <main
      dir={content.dir}
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem",
        textAlign: content.dir === "rtl" ? "right" : "left",
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
