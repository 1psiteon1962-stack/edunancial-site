import BilingualContent from "@/components/international/BilingualContent";

function AccessibilityLayout({
  label,
  title,
  intro,
  items,
}: {
  label: string;
  title: string;
  intro: string;
  items: [string, string][];
}) {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{label}</p>
        <h1 className="mt-4 text-5xl font-black">{title}</h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">{intro}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map(([sectionTitle, body]) => (
            <div key={sectionTitle} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black">{sectionTitle}</h2>
              <p className="mt-3 leading-7 text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function AccessibilityPage() {
  return (
    <BilingualContent
      en={
        <AccessibilityLayout
          label="Accessibility / ADA"
          title="Accessibility Commitment"
          intro="Edunancial is committed to making financial education and member tools accessible to more people across devices, screen sizes, and assistive technologies."
          items={[
            ["Accessible layouts", "We prioritize readable contrast, larger touch targets, responsive layouts, and keyboard-friendly navigation in launch-critical areas."],
            ["Feedback path", "If you encounter an accessibility barrier, email support@edunancial.com so we can review and prioritize a fix."],
          ]}
        />
      }
      es={
        <AccessibilityLayout
          label="Accesibilidad / ADA"
          title="Compromiso de accesibilidad"
          intro="Edunancial está comprometido con hacer que la educación financiera y las herramientas para miembros sean más accesibles en distintos dispositivos, tamaños de pantalla y tecnologías de asistencia."
          items={[
            ["Diseños accesibles", "Priorizamos contraste legible, objetivos táctiles más grandes, diseños responsivos y navegación compatible con teclado en áreas críticas del lanzamiento."],
            ["Canal de comentarios", "Si encuentra una barrera de accesibilidad, escriba a support@edunancial.com para que podamos revisarla y priorizar una solución."],
          ]}
        />
      }
      fr={
        <AccessibilityLayout
          label="Accessibilité / ADA"
          title="Engagement d'accessibilité"
          intro="Edunancial s'engage à rendre l'éducation financière et les outils pour membres accessibles à davantage de personnes sur différents appareils, tailles d'écran et technologies d'assistance."
          items={[
            ["Mises en page accessibles", "Nous privilégions un contraste lisible, des cibles tactiles plus grandes, des mises en page réactives et une navigation compatible avec le clavier dans les zones critiques du lancement."],
            ["Canal de retour", "Si vous rencontrez une barrière d'accessibilité, envoyez un e-mail à support@edunancial.com afin que nous puissions examiner et prioriser un correctif."],
          ]}
        />
      }
    />
  );
}
