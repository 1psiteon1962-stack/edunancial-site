import { notFound } from "next/navigation";
import { resolveCopy } from "@/lib/content";
import CashFlowMapper from "@/app/components/CashFlowMapper";
import DisciplineTracker from "@/app/components/DisciplineTracker";

type PageProps = {
  params: {
    lang: "en" | "es" | "fr";
  };
};

export default function AfricaPage({ params }: PageProps) {
  const copy = resolveCopy("AFRICA", params.lang);

  if (!copy) notFound();

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>{copy.title}</h1>
      <p>{copy.body}</p>

      <DisciplineTracker region="AFRICA" />
      <CashFlowMapper region="AFRICA" />
    </main>
  );
}
