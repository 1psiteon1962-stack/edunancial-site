import { notFound } from "next/navigation";
import { resolveCopy } from "@/lib/content";
import { Language } from "@/lib/core";
import DisciplineTracker from "@/app/components/DisciplineTracker";
import CashFlowMapper from "@/app/components/CashFlowMapper";

export async function generateStaticParams() {
  return [{ lang: "en" }];
}

export default function Page({ params }: { params: { lang: Language } }) {
  const copy = resolveCopy("AFRICA", params.lang) ?? resolveCopy("AFRICA", "en");
  if (!copy) notFound();

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      <h1>{copy.title}</h1>
      <p>{copy.body}</p>

      <CashFlowMapper region="AFRICA" />

      <DisciplineTracker />
    </main>
  );
}
