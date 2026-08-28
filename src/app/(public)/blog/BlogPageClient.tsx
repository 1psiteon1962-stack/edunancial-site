"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import ComingSoon from "@/components/ComingSoon";
import { normalizeLanguageCode } from "@/lib/international/languages";

const BLOG_COPY = {
  en: { title: "Blog", aria: "Upcoming topics", topics: ["Financial Literacy", "Economic Self Defense", "Business Ownership", "Real Estate", "Paper Assets", "Entrepreneurship"] },
  es: { title: "Blog", aria: "Próximos temas", topics: ["Alfabetización financiera", "Autodefensa económica", "Propiedad de negocios", "Bienes raíces", "Activos financieros", "Emprendimiento"] },
  fr: { title: "Blogue", aria: "Sujets à venir", topics: ["Littératie financière", "Autodéfense économique", "Propriété d’entreprise", "Immobilier", "Actifs financiers", "Entrepreneuriat"] },
  pt: { title: "Blog", aria: "Próximos temas", topics: ["Educação financeira", "Autodefesa econômica", "Propriedade empresarial", "Imóveis", "Ativos financeiros", "Empreendedorismo"] },
  de: { title: "Blog", aria: "Kommende Themen", topics: ["Finanzbildung", "Wirtschaftliche Selbstverteidigung", "Unternehmenseigentum", "Immobilien", "Finanzanlagen", "Unternehmertum"] },
  it: { title: "Blog", aria: "Prossimi argomenti", topics: ["Alfabetizzazione finanziaria", "Autodifesa economica", "Proprietà d’impresa", "Immobiliare", "Attività finanziarie", "Imprenditorialità"] },
  nl: { title: "Blog", aria: "Komende onderwerpen", topics: ["Financiële geletterdheid", "Economische zelfverdediging", "Bedrijfseigendom", "Vastgoed", "Financiële activa", "Ondernemerschap"] },
} as const;

function getBlogCopy(languageCode: string) {
  const locale = normalizeLanguageCode(languageCode);
  if (locale.startsWith("es")) return BLOG_COPY.es;
  if (locale.startsWith("fr")) return BLOG_COPY.fr;
  if (locale.startsWith("pt")) return BLOG_COPY.pt;
  if (locale === "de") return BLOG_COPY.de;
  if (locale === "it") return BLOG_COPY.it;
  if (locale === "nl") return BLOG_COPY.nl;
  return BLOG_COPY.en;
}

export default function BlogPageClient() {
  const { effectiveLanguage, t } = useInternationalPreferences();
  const copy = getBlogCopy(effectiveLanguage);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-400">{t("comingSoon.label")}</p>
        <h1 className="mt-6 text-5xl font-black sm:text-6xl">{copy.title}</h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">{t("comingSoon.blog.body")}</p>
        <ul className="mt-8 flex flex-wrap gap-3" aria-label={copy.aria}>
          {copy.topics.map((topic) => <li key={topic} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300">{topic}</li>)}
        </ul>
        <div className="mt-16"><ComingSoon labelKey="comingSoon.label" headingKey="comingSoon.blog.heading" bodyKey="comingSoon.blog.body" ctaLabelKey="comingSoon.blog.cta" ctaHref="/curriculum" /></div>
      </section>
    </main>
  );
}
