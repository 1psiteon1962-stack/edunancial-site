import BilingualContent from "@/components/international/BilingualContent";

export default function AccessibilityPage() {
  return (
    <BilingualContent
      en={
        <main className="min-h-screen bg-[#08101f] text-white">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              Accessibility / ADA
            </p>
            <h1 className="mt-4 text-5xl font-black">Accessibility Commitment</h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Edunancial is committed to making financial education and member tools accessible to
              more people across devices, screen sizes, and assistive technologies.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {[
                ["Accessible layouts", "We prioritize readable contrast, larger touch targets, responsive layouts, and keyboard-friendly navigation in launch-critical areas."],
                ["Feedback path", "If you encounter an accessibility barrier, email support@edunancial.com so we can review and prioritize a fix."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-2xl font-black">{title}</h2>
                  <p className="mt-3 leading-7 text-slate-300">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      }
      es={
        <main className="min-h-screen bg-[#08101f] text-white">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              Accesibilidad / ADA
            </p>
            <h1 className="mt-4 text-5xl font-black">Compromiso de accesibilidad</h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Edunancial está comprometido con hacer que la educación financiera y las herramientas
              para miembros sean más accesibles en distintos dispositivos, tamaños de pantalla y
              tecnologías de asistencia.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {[
                ["Diseños accesibles", "Priorizamos contraste legible, objetivos táctiles más grandes, diseños responsivos y navegación compatible con teclado en áreas críticas del lanzamiento."],
                ["Canal de comentarios", "Si encuentra una barrera de accesibilidad, escriba a support@edunancial.com para que podamos revisarla y priorizar una solución."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-2xl font-black">{title}</h2>
                  <p className="mt-3 leading-7 text-slate-300">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      }
    />
  );
}
