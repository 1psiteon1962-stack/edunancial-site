import { notFound } from "next/navigation";
import { resolveCopy } from "@/lib/content";
import { Language } from "@/lib/core";
import DisciplineTracker from "@/app/components/DisciplineTracker";

export async function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

export default function Page({ params }: { params: { lang: Language } }) {
  const copy =
    resolveCopy("LATAM", params.lang) ??
    resolveCopy("LATAM", "es");

  if (!copy) notFound();

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      <h1>{copy.title}</h1>
      <p>{copy.body}</p>

      <nav>
        <a href="/latam/es">Español</a> |{" "}
        <a href="/latam/en">English</a>
      </nav>

      <DisciplineTracker />
    </main>
  );
}
