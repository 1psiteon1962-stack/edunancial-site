import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import MemberSuccessStories from "@/components/home/MemberSuccessStories";
import BilingualContent from "@/components/international/BilingualContent";
import { isLoggedIn } from "@/lib/auth";
import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_LONG_DESCRIPTION,
  EDUNANCIAL_METHODS_CLARIFICATION,
} from "@/lib/positioning";

export const metadata: Metadata = {
  title: "Edunancial | Financial Literacy & Financial Competency Membership Platform",
  description: EDUNANCIAL_LONG_DESCRIPTION,
  keywords: [
    "financial competency platform",
    "financial literacy membership",
    "real estate knowledge",
    "investment knowledge",
    "business competency",
    "AI financial coach",
    "practical financial knowledge",
  ],
  alternates: {
    canonical: "https://www.edunancial.com",
  },
  openGraph: {
    title: "Edunancial | Financial Literacy & Financial Competency Membership Platform",
    description: EDUNANCIAL_LONG_DESCRIPTION,
    url: "https://www.edunancial.com",
    siteName: "Edunancial",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Edunancial financial competency learning platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edunancial | Financial Literacy & Financial Competency Membership Platform",
    description: EDUNANCIAL_IDENTITY,
    images: ["/og-image.png"],
  },
};

function HomeLayout({
  storyLabel,
  storyHeading,
  storyParagraphs,
  storyLinks,
  storyCards,
  heroTitle,
  heroDescription,
  heroMethods,
  ctas,
  heroBadges,
  dashboardLabel,
  dashboardHeading,
  dashboardLink,
  dashboardCards,
  trialLabel,
  trialBody,
  finalLabel,
  finalHeading,
  finalBody,
  finalPrimary,
  finalSecondary,
}: {
  storyLabel: string;
  storyHeading: string;
  storyParagraphs: string[];
  storyLinks: { href: string; label: string }[];
  storyCards: [string, string][];
  heroTitle: string;
  heroDescription: string;
  heroMethods: string;
  ctas: { href: string; label: string; className: string }[];
  heroBadges: string[];
  dashboardLabel: string;
  dashboardHeading: string;
  dashboardLink: { href: string; label: string };
  dashboardCards: [string, string, string][];
  trialLabel: string;
  trialBody: string;
  finalLabel: string;
  finalHeading: string;
  finalBody: string;
  finalPrimary: { href: string; label: string };
  finalSecondary: { href: string; label: string };
}) {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section aria-labelledby="homepage-story-heading" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-10 rounded-3xl border border-white/10 bg-slate-950/50 p-8 md:p-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">{storyLabel}</p>
            <h2 id="homepage-story-heading" className="mt-6 text-3xl font-black sm:text-4xl md:text-5xl">
              {storyHeading}
            </h2>
            <div className="mt-6 max-w-3xl space-y-4 text-lg leading-8 text-slate-300">
              {storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {storyLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={index === 0
                    ? "inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700"
                    : "inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-4 font-bold text-white transition hover:bg-white hover:text-slate-950"}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {storyCards.map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="homepage-hero-heading" className="border-b border-white/10 bg-gradient-to-b from-[#08101f] via-[#0d1730] to-[#08101f]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-300 md:text-sm">Edunancial</p>
            <h1 id="homepage-hero-heading" className="mt-6 text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
              {heroTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8 md:text-xl">
              {heroDescription}
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
              {heroMethods}
            </p>
            <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {ctas.map((cta) => (
                <Link key={cta.label} href={cta.href} className={cta.className}>
                  {cta.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              {heroBadges.map((badge) => (
                <span key={badge} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MemberSuccessStories stories={[]} />

      <section aria-labelledby="homepage-dashboard-heading" className="mx-auto max-w-7xl px-6 pb-16 md:pb-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">{dashboardLabel}</p>
            <h2 id="homepage-dashboard-heading" className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
              {dashboardHeading}
            </h2>
          </div>
          <Link href={dashboardLink.href} className="font-bold text-blue-300 hover:text-blue-200">
            {dashboardLink.label}
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardCards.map(([title, description, href]) => (
            <Link key={title} href={href} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 transition hover:border-blue-400 hover:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-black sm:text-2xl">{title}</h3>
                <span aria-hidden="true" className="text-blue-300">&rarr;</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label={trialLabel} className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400">{trialLabel}</p>
            <p className="mt-2 text-sm text-slate-300">{trialBody}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="homepage-final-cta-heading" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-8 md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-blue-300">{finalLabel}</p>
              <h2 id="homepage-final-cta-heading" className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
                {finalHeading}
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">{finalBody}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href={finalPrimary.href} className="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-5 text-center font-black text-slate-950 transition hover:bg-yellow-300">
                {finalPrimary.label}
              </Link>
              <Link href={finalSecondary.href} className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-6 py-5 text-center font-bold text-white transition hover:bg-white/20">
                {finalSecondary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function HomePage() {
  if (isLoggedIn()) {
    redirect("/dashboard");
  }

  const primaryCtaClasses = [
    "inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-4 text-base font-black text-black transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
    "inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
    "inline-flex items-center justify-center rounded-xl border border-white/60 px-6 py-4 text-base font-bold transition hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
  ];

  return (
    <BilingualContent
      en={
        <HomeLayout
          storyLabel="Our Story"
          storyHeading="Why Edunancial?"
          storyParagraphs={[
            "Edunancial began with a simple question between a father and his son: “How do you work with your head?”",
            "That conversation grew into a system for teaching practical wealth-building across RED for real estate, WHITE for paper assets, and BLUE for business.",
            "Financial literacy gives people vocabulary. Financial competency helps them use that knowledge with disciplined action, measurable progress, and better decision-making.",
            "Our mission is to help members move from theory to practical judgment they can apply for life.",
          ]}
          storyLinks={[
            { href: "/our-story", label: "Read Our Story" },
            { href: "/mission", label: "Mission & Vision" },
          ]}
          storyCards={[
            ["Why we exist", "To turn financial literacy into applied financial competency."],
            ["The mission", "Make practical wealth-building knowledge clear, useful, and accessible."],
            ["The philosophy", "Financial Literacy → Financial Competency → Disciplined Action → Measurable Progress → Wealth Building."],
          ]}
          heroTitle="What is Edunancial?"
          heroDescription={EDUNANCIAL_LONG_DESCRIPTION}
          heroMethods={EDUNANCIAL_METHODS_CLARIFICATION}
          ctas={[
            { href: "/register", label: "Become a Member", className: primaryCtaClasses[0] },
            { href: "/pricing", label: "View Membership Plans", className: primaryCtaClasses[1] },
            { href: "/login", label: "Log In", className: primaryCtaClasses[2] },
          ]}
          heroBadges={[
            "Invitation-only beta access remains hidden from public pricing",
            "Color-coded learning paths across Red, White, and Blue",
            "AI-guided next steps for better decisions",
          ]}
          dashboardLabel="Public Dashboard"
          dashboardHeading="Navigate every major area in two clicks or less"
          dashboardLink={{ href: "/dashboard", label: "Preview the member dashboard →" }}
          dashboardCards={[
            ["Financial Literacy", "Budgeting, cash flow, saving, and financial fundamentals.", "/courses/white"],
            ["Real Estate", "Creative finance, tax liens, rentals, and long-term asset building.", "/courses/red"],
            ["Entrepreneurship", "Profit, pricing, KPIs, leadership, and business growth.", "/courses/blue"],
            ["AI Financial Coach", "Get guided next steps, recommendations, and on-demand support.", "/ai-coach"],
            ["Courses", "Browse Edunancial learning paths across every wealth-building pillar.", "/courses"],
            ["Books", "Explore books, workbooks, and supporting learning resources.", "/books"],
            ["Community", "Stay connected with other learners, families, and builders.", "/community"],
            ["Resources", "Access downloads, tools, and practice materials in one place.", "/downloads"],
            ["Member Dashboard", "Jump into progress tracking, saved resources, and member tools.", "/dashboard"],
          ]}
          trialLabel="Free Trial"
          trialBody="Content under development."
          finalLabel="Ready to Start"
          finalHeading="Become a member and build momentum this week"
          finalBody="Join to unlock structured learning paths, progress tracking, member tools, and AI-guided support that helps you make better financial decisions faster."
          finalPrimary={{ href: "/register", label: "Start Membership" }}
          finalSecondary={{ href: "/ai-coach", label: "Try the AI Financial Coach" }}
        />
      }
      es={
        <HomeLayout
          storyLabel="Nuestra historia"
          storyHeading="¿Por qué existe Edunancial?"
          storyParagraphs={[
            "Edunancial comenzó con una pregunta sencilla entre un padre y su hijo: “¿Cómo trabajas con tu mente?”",
            "Esa conversación se convirtió en un sistema para enseñar construcción práctica de riqueza con RED para bienes raíces, WHITE para activos financieros y BLUE para negocios.",
            "La alfabetización financiera da vocabulario. La competencia financiera ayuda a usar ese conocimiento con acción disciplinada, progreso medible y mejores decisiones.",
            "Nuestra misión es ayudar a los miembros a pasar de la teoría al juicio práctico que puedan aplicar durante toda la vida.",
          ]}
          storyLinks={[
            { href: "/our-story", label: "Leer nuestra historia" },
            { href: "/mission", label: "Misión y visión" },
          ]}
          storyCards={[
            ["Por qué existimos", "Para convertir la alfabetización financiera en competencia financiera aplicada."],
            ["La misión", "Hacer que el conocimiento práctico para crear riqueza sea claro, útil y accesible."],
            ["La filosofía", "Alfabetización financiera → Competencia financiera → Acción disciplinada → Progreso medible → Construcción de riqueza."],
          ]}
          heroTitle="¿Qué es Edunancial?"
          heroDescription="Edunancial es una plataforma de membresía dedicada a mejorar la alfabetización financiera y la competencia financiera mediante recursos estructurados, herramientas interactivas, ejercicios prácticos y métodos apoyados por tecnología."
          heroMethods="Edunancial puede usar rutas de aprendizaje estructuradas, preguntas socráticas, inteligencia artificial, repetición, tarjetas de estudio, cuestionarios y ejercicios prácticos para ayudar a los miembros a mejorar su alfabetización financiera y competencia financiera."
          ctas={[
            { href: "/register", label: "Hazte miembro", className: primaryCtaClasses[0] },
            { href: "/pricing", label: "Ver planes de membresía", className: primaryCtaClasses[1] },
            { href: "/login", label: "Iniciar sesión", className: primaryCtaClasses[2] },
          ]}
          heroBadges={[
            "El acceso beta por invitación permanece oculto de los precios públicos",
            "Rutas de aprendizaje codificadas por colores en Red, White y Blue",
            "Próximos pasos guiados por IA para mejores decisiones",
          ]}
          dashboardLabel="Panel público"
          dashboardHeading="Navegue por cada área principal en dos clics o menos"
          dashboardLink={{ href: "/dashboard", label: "Vista previa del panel del miembro →" }}
          dashboardCards={[
            ["Alfabetización financiera", "Presupuesto, flujo de caja, ahorro y fundamentos financieros.", "/courses/white"],
            ["Bienes raíces", "Financiamiento creativo, gravámenes fiscales, alquileres y construcción patrimonial a largo plazo.", "/courses/red"],
            ["Emprendimiento", "Utilidad, precios, KPI, liderazgo y crecimiento del negocio.", "/courses/blue"],
            ["Coach financiero con IA", "Obtenga próximos pasos guiados, recomendaciones y apoyo bajo demanda.", "/ai-coach"],
            ["Cursos", "Explore rutas de aprendizaje de Edunancial en cada pilar de creación de riqueza.", "/courses"],
            ["Libros", "Explore libros, cuadernos y recursos complementarios de aprendizaje.", "/books"],
            ["Comunidad", "Manténgase conectado con otros aprendices, familias y constructores.", "/community"],
            ["Recursos", "Acceda a descargas, herramientas y materiales de práctica en un solo lugar.", "/downloads"],
            ["Panel del miembro", "Entre al seguimiento de progreso, recursos guardados y herramientas para miembros.", "/dashboard"],
          ]}
          trialLabel="Prueba gratuita"
          trialBody="Contenido en desarrollo."
          finalLabel="Listo para empezar"
          finalHeading="Hágase miembro y construya impulso esta semana"
          finalBody="Únase para desbloquear rutas de aprendizaje estructuradas, seguimiento de progreso, herramientas para miembros y apoyo guiado por IA que le ayude a tomar mejores decisiones financieras."
          finalPrimary={{ href: "/register", label: "Comenzar membresía" }}
          finalSecondary={{ href: "/ai-coach", label: "Probar el Coach financiero con IA" }}
        />
      }
      fr={
        <HomeLayout
          storyLabel="Notre histoire"
          storyHeading="Pourquoi Edunancial ?"
          storyParagraphs={[
            "Edunancial est né d'une question simple entre un père et son fils : « Comment travailles-tu avec ta tête ? »",
            "Cette conversation s'est transformée en un système pour enseigner la création pratique de richesse avec RED pour l'immobilier, WHITE pour les actifs financiers et BLUE pour les affaires.",
            "La littératie financière donne du vocabulaire. La compétence financière aide à utiliser ces connaissances avec une action disciplinée, des progrès mesurables et de meilleures décisions.",
            "Notre mission est d'aider les membres à passer de la théorie au jugement pratique qu'ils pourront appliquer toute leur vie.",
          ]}
          storyLinks={[
            { href: "/our-story", label: "Lire notre histoire" },
            { href: "/mission", label: "Mission et vision" },
          ]}
          storyCards={[
            ["Pourquoi nous existons", "Transformer la littératie financière en compétence financière appliquée."],
            ["La mission", "Rendre les connaissances pratiques de création de richesse claires, utiles et accessibles."],
            ["La philosophie", "Littératie financière → Compétence financière → Action disciplinée → Progrès mesurables → Création de richesse."],
          ]}
          heroTitle="Qu'est-ce qu'Edunancial ?"
          heroDescription="Edunancial est une plateforme d'abonnement consacrée à l'amélioration de la littératie financière et de la compétence financière grâce à des ressources d'apprentissage structurées, des outils interactifs, des exercices pratiques et des méthodes soutenues par la technologie."
          heroMethods="Edunancial peut utiliser des parcours d'apprentissage structurés, le questionnement socratique, l'intelligence artificielle, la répétition, des cartes mémoire, des questionnaires et des exercices pratiques pour aider les membres à améliorer leur littératie financière et leur compétence financière."
          ctas={[
            { href: "/register", label: "Devenir membre", className: primaryCtaClasses[0] },
            { href: "/pricing", label: "Voir les plans d'abonnement", className: primaryCtaClasses[1] },
            { href: "/login", label: "Se connecter", className: primaryCtaClasses[2] },
          ]}
          heroBadges={[
            "L'accès bêta sur invitation reste masqué des tarifs publics",
            "Des parcours d'apprentissage codés par couleur en Red, White et Blue",
            "Des prochaines étapes guidées par l'IA pour de meilleures décisions",
          ]}
          dashboardLabel="Tableau public"
          dashboardHeading="Accédez à chaque grande zone en deux clics ou moins"
          dashboardLink={{ href: "/dashboard", label: "Aperçu du tableau de bord membre →" }}
          dashboardCards={[
            ["Littératie financière", "Budget, flux de trésorerie, épargne et fondamentaux financiers.", "/courses/white"],
            ["Immobilier", "Financement créatif, privilèges fiscaux, locations et création de patrimoine à long terme.", "/courses/red"],
            ["Entrepreneuriat", "Profit, tarification, KPI, leadership et croissance de l'entreprise.", "/courses/blue"],
            ["Coach financier IA", "Obtenez des prochaines étapes guidées, des recommandations et un support à la demande.", "/ai-coach"],
            ["Cours", "Parcourez les parcours d'apprentissage d'Edunancial pour chaque pilier de création de richesse.", "/courses"],
            ["Livres", "Découvrez des livres, des cahiers et des ressources d'apprentissage complémentaires.", "/books"],
            ["Communauté", "Restez en lien avec d'autres apprenants, familles et bâtisseurs.", "/community"],
            ["Ressources", "Accédez aux téléchargements, outils et supports pratiques en un seul endroit.", "/downloads"],
            ["Tableau de bord membre", "Accédez au suivi de progression, aux ressources sauvegardées et aux outils pour membres.", "/dashboard"],
          ]}
          trialLabel="Essai gratuit"
          trialBody="Contenu en développement."
          finalLabel="Prêt à commencer"
          finalHeading="Devenez membre et créez de l'élan cette semaine"
          finalBody="Rejoignez-nous pour débloquer des parcours d'apprentissage structurés, le suivi de progression, des outils pour membres et un support guidé par l'IA qui vous aide à prendre plus rapidement de meilleures décisions financières."
          finalPrimary={{ href: "/register", label: "Commencer l'abonnement" }}
          finalSecondary={{ href: "/ai-coach", label: "Essayer le Coach financier IA" }}
        />
      }
    />
  );
}
