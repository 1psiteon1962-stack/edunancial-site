import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * Required for Next.js static export
 */
export function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export default function Page({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;

  if (!["ar", "en"].includes(lang)) {
    notFound();
  }

  const content = {
    ar: {
      title: "إيدونانشال — الشرق الأوسط وشمال أفريقيا",
      subtitle:
        "هيكلة مالية، أنظمة عملية، وانضباط في رأس المال.",
      body:
        "إيدونانشال ليس نظريًا. إنه إطار تشغيلي مصمم لبيئات اقتصادية غير مستقرة.",
    },
    en: {
      title: "Edunancial — MENA",
      subtitle:
        "Financial structure, practical systems, and capital discipline.",
      body:
        "Edunancial is not theory. It is an operating framework designed for volatile economic regions.",
    },
  }[lang];

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem",
        direction: lang === "ar" ? "rtl" : "ltr",
        textAlign: lang === "ar" ? "right" : "left",
      }}
    >
      {/* Language Switch */}
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/mena/ar">AR</Link> |{" "}
        <Link href="/mena/en">EN</Link>
      </div>

      <h1>{content.title}</h1>
      <h3>{content.subtitle}</h3>

      <p>{content.body}</p>
    </main>
  );
}
