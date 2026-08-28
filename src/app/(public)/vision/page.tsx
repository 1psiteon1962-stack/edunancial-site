"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { normalizeLanguageCode } from "@/lib/international/languages";

const visionCopy = {
  en: { title: "Our Vision", body: "To build the world's leading financial education ecosystem where learning, AI, entrepreneurship, professional services, and business growth work together in one platform." },
  es: { title: "Nuestra visión", body: "Construir el ecosistema de educación financiera líder en el mundo, donde el aprendizaje, la inteligencia artificial, el emprendimiento, los servicios profesionales y el crecimiento empresarial trabajen juntos en una sola plataforma." },
  fr: { title: "Notre vision", body: "Construire le principal écosystème mondial d’éducation financière, où l’apprentissage, l’intelligence artificielle, l’entrepreneuriat, les services professionnels et la croissance des entreprises fonctionnent ensemble sur une seule plateforme." },
  pt: { title: "Nossa visão", body: "Construir o principal ecossistema de educação financeira do mundo, onde aprendizagem, inteligência artificial, empreendedorismo, serviços profissionais e crescimento empresarial funcionem juntos em uma única plataforma." },
  de: { title: "Unsere Vision", body: "Das weltweit führende Ökosystem für Finanzbildung aufzubauen, in dem Lernen, künstliche Intelligenz, Unternehmertum, professionelle Dienstleistungen und Unternehmenswachstum auf einer Plattform zusammenwirken." },
  it: { title: "La nostra visione", body: "Costruire il principale ecosistema mondiale di educazione finanziaria, in cui apprendimento, intelligenza artificiale, imprenditorialità, servizi professionali e crescita aziendale lavorino insieme su un’unica piattaforma." },
  nl: { title: "Onze visie", body: "Het toonaangevende ecosysteem voor financiële educatie ter wereld bouwen, waarin leren, kunstmatige intelligentie, ondernemerschap, professionele dienstverlening en bedrijfsgroei samenwerken op één platform." },
} as const;

function getVisionCopy(locale: string) {
  const language = normalizeLanguageCode(locale);
  if (language.startsWith("es")) return visionCopy.es;
  if (language.startsWith("fr")) return visionCopy.fr;
  if (language.startsWith("pt")) return visionCopy.pt;
  if (language === "de") return visionCopy.de;
  if (language === "it") return visionCopy.it;
  if (language === "nl") return visionCopy.nl;
  return visionCopy.en;
}

export default function VisionPage() {
  const { effectiveLanguage } = useInternationalPreferences();
  const copy = getVisionCopy(effectiveLanguage);
  return <main className="min-h-screen bg-white"><div className="mx-auto max-w-5xl p-10"><h1 className="text-5xl font-black">{copy.title}</h1><p className="mt-8 text-xl">{copy.body}</p></div></main>;
}
