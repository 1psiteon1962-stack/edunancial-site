import BilingualContent from "@/components/international/BilingualContent";

export const metadata = {
  title: "AI Financial Coach | Edunancial",
};

const enFeatures = [
  "Personal Financial Coach",
  "Business Coach",
  "Investment Guidance",
  "Course Recommendations",
  "Book Recommendations",
  "Goal Tracking",
  "Competency Analysis",
  "24/7 AI Assistance",
];

const esFeatures = [
  "Coach financiero personal",
  "Coach de negocios",
  "Guía de inversión",
  "Recomendaciones de cursos",
  "Recomendaciones de libros",
  "Seguimiento de metas",
  "Análisis de competencia",
  "Asistencia de IA 24/7",
];

const frFeatures = [
  "Coach financier personnel",
  "Coach d'affaires",
  "Conseils en investissement",
  "Recommandations de cours",
  "Recommandations de livres",
  "Suivi des objectifs",
  "Analyse des compétences",
  "Assistance IA 24/7",
];

export default function AICoachPage() {
  return (
    <BilingualContent
      en={
        <main className="min-h-screen bg-[#08101f] text-white">
          <section className="mx-auto max-w-7xl px-6 py-24">
            <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">AI Financial Coach</p>
            <h1 className="mt-6 text-5xl font-black md:text-6xl">
              Learn smarter.
              <br />
              Grow with clearer next steps.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              The Edunancial AI Coach helps members move from financial literacy to practical
              decision-making with guided prompts, course recommendations, and action-oriented
              follow-up.
            </p>

            <div className="mt-20 grid gap-8 md:grid-cols-2">
              {enFeatures.map((feature) => (
                <div key={feature} className="rounded-xl bg-slate-900 p-8">
                  <h2 className="text-2xl font-black">{feature}</h2>
                </div>
              ))}
            </div>
          </section>
        </main>
      }
      es={
        <main className="min-h-screen bg-[#08101f] text-white">
          <section className="mx-auto max-w-7xl px-6 py-24">
            <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">Coach financiero con IA</p>
            <h1 className="mt-6 text-5xl font-black md:text-6xl">
              Aprenda con más claridad.
              <br />
              Avance con mejores próximos pasos.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              El Coach de IA de Edunancial ayuda a los miembros a pasar de la alfabetización
              financiera a la toma de decisiones práctica con indicaciones guiadas,
              recomendaciones de cursos y seguimiento orientado a la acción.
            </p>

            <div className="mt-20 grid gap-8 md:grid-cols-2">
              {esFeatures.map((feature) => (
                <div key={feature} className="rounded-xl bg-slate-900 p-8">
                  <h2 className="text-2xl font-black">{feature}</h2>
                </div>
              ))}
            </div>
          </section>
        </main>
      }
      fr={
        <main className="min-h-screen bg-[#08101f] text-white">
          <section className="mx-auto max-w-7xl px-6 py-24">
            <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">Coach financier IA</p>
            <h1 className="mt-6 text-5xl font-black md:text-6xl">
              Apprenez plus efficacement.
              <br />
              Progressez avec des prochaines étapes claires.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Le Coach IA d'Edunancial aide les membres à passer de la littératie financière à la
              prise de décision pratique avec des suggestions guidées, des recommandations de cours
              et un suivi orienté vers l'action.
            </p>

            <div className="mt-20 grid gap-8 md:grid-cols-2">
              {frFeatures.map((feature) => (
                <div key={feature} className="rounded-xl bg-slate-900 p-8">
                  <h2 className="text-2xl font-black">{feature}</h2>
                </div>
              ))}
            </div>
          </section>
        </main>
      }
    />
  );
}
