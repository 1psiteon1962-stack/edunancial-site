"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { normalizeLanguageCode } from "@/lib/international/languages";

const missionCopy = {
  en: {
    title: "Our Mission",
    body: "To make practical financial literacy accessible worldwide while helping individuals develop the knowledge and confidence to make better financial and business decisions.",
  },
  es: {
    title: "Nuestra misión",
    body: "Hacer que la educación financiera práctica sea accesible en todo el mundo, ayudando a las personas a desarrollar el conocimiento y la confianza necesarios para tomar mejores decisiones financieras y empresariales.",
  },
  fr: {
    title: "Notre mission",
    body: "Rendre la littératie financière pratique accessible partout dans le monde tout en aidant les personnes à développer les connaissances et la confiance nécessaires pour prendre de meilleures décisions financières et d’affaires.",
  },
  pt: {
    title: "Nossa missão",
    body: "Tornar a educação financeira prática acessível em todo o mundo, ajudando as pessoas a desenvolver o conhecimento e a confiança necessários para tomar melhores decisões financeiras e empresariais.",
  },
  de: {
    title: "Unsere Mission",
    body: "Praktische Finanzbildung weltweit zugänglich zu machen und Menschen dabei zu helfen, das Wissen und Selbstvertrauen zu entwickeln, um bessere finanzielle und geschäftliche Entscheidungen zu treffen.",
  },
  it: {
    title: "La nostra missione",
    body: "Rendere l’alfabetizzazione finanziaria pratica accessibile in tutto il mondo, aiutando le persone a sviluppare le conoscenze e la fiducia necessarie per prendere decisioni finanziarie e aziendali migliori.",
  },
  nl: {
    title: "Onze missie",
    body: "Praktische financiële geletterdheid wereldwijd toegankelijk maken en mensen helpen de kennis en het vertrouwen te ontwikkelen om betere financiële en zakelijke beslissingen te nemen.",
  },
} as const;

function getMissionCopy(locale: string) {
  const language = normalizeLanguageCode(locale);
  if (language.startsWith("es")) return missionCopy.es;
  if (language.startsWith("fr")) return missionCopy.fr;
  if (language.startsWith("pt")) return missionCopy.pt;
  if (language === "de") return missionCopy.de;
  if (language === "it") return missionCopy.it;
  if (language === "nl") return missionCopy.nl;
  return missionCopy.en;
}

export default function MissionPage() {
  const { effectiveLanguage } = useInternationalPreferences();
  const copy = getMissionCopy(effectiveLanguage);

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl p-10">
        <h1 className="text-5xl font-black">{copy.title}</h1>
        <p className="mt-8 text-xl">{copy.body}</p>
      </div>
    </main>
  );
}
