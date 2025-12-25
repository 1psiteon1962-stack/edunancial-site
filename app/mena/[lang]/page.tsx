import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * REQUIRED for Next.js static export
 */
export function generateStaticParams() {
  return [
    { lang: "ar" },
    { lang: "en" },
  ];
}

export default function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;

  if (!["ar", "en"].includes(lang)) {
    notFound();
  }

  const content =
    lang === "ar"
      ? {
          dir: "rtl",
          title: "إديوفنانشل — الشرق الأوسط وشمال أفريقيا",
          subtitle:
            "الهيكلة المالية، الانضباط، والاستمرارية طويلة الأجل.",
          body:
            "نركز على بناء الأنظمة المالية، الحوكمة، واستراتيجيات رأس المال المستدامة للأسواق الإقليمية.",
        }
      : {
          dir: "ltr",
          title: "Edunancial — MENA",
          subtitle:
            "Financial structure, discipline, and long-term continuity.",
          body:
            "We focus on capital systems, governance, and durable financial strategies across the MENA region.",
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
        <Link href="/mena/ar">AR</Link>{" | "}
        <Link href="/mena/en">EN</Link>
      </div>

      <h1>{content.title}</h1>
      <h3>{content.subtitle}</h3>

      <p>{content.body}</p>
    </main>
  );
}
