import BilingualContent from "@/components/international/BilingualContent";

export const metadata = {
  title: "Contact Edunancial",
};

export default function ContactPage() {
  return (
    <BilingualContent
      en={
        <main className="min-h-screen bg-[#08101f] text-white">
          <section className="mx-auto max-w-5xl px-6 py-24">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              Contact Edunancial
            </p>
            <h1 className="mt-6 text-5xl font-black md:text-6xl">
              Reach the right team without dead ends
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              To keep North America launch support reliable, Edunancial currently publishes only the
              active inboxes that are monitored today. Use the address that best matches your next
              step and include your membership email whenever possible.
            </p>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "General information",
                  email: "info@edunancial.com",
                  description:
                    "Questions about memberships, launch availability, organization access, or the overall Edunancial experience.",
                },
                {
                  title: "Customer support",
                  email: "support@edunancial.com",
                  description:
                    "Need help with login, checkout readiness, beta access, certificates, course progress, or technical issues? Start here.",
                },
              ].map((item) => (
                <div key={item.email} className="rounded-2xl border border-white/10 bg-slate-900/80 p-8">
                  <h2 className="text-2xl font-black">{item.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
                  <a
                    href={`mailto:${item.email}`}
                    className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
                  >
                    {item.email}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-6 text-sm leading-7 text-yellow-50">
              Department-specific addresses remain under development and are intentionally hidden
              until they are fully operational.
            </div>
          </section>
        </main>
      }
      es={
        <main className="min-h-screen bg-[#08101f] text-white">
          <section className="mx-auto max-w-5xl px-6 py-24">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              Contacto con Edunancial
            </p>
            <h1 className="mt-6 text-5xl font-black md:text-6xl">
              Comuníquese con el equipo correcto sin callejones sin salida
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Para mantener un soporte confiable durante el lanzamiento en Norteamérica,
              Edunancial publica únicamente los buzones activos que ya se supervisan. Use la
              dirección que mejor corresponda a su siguiente paso e incluya su correo de membresía
              cuando sea posible.
            </p>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Información general",
                  email: "info@edunancial.com",
                  description:
                    "Preguntas sobre membresías, disponibilidad de lanzamiento, acceso para organizaciones o la experiencia general de Edunancial.",
                },
                {
                  title: "Soporte al cliente",
                  email: "support@edunancial.com",
                  description:
                    "¿Necesita ayuda con el inicio de sesión, la preparación del pago, el acceso beta, los certificados, el progreso del curso o problemas técnicos? Empiece aquí.",
                },
              ].map((item) => (
                <div key={item.email} className="rounded-2xl border border-white/10 bg-slate-900/80 p-8">
                  <h2 className="text-2xl font-black">{item.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
                  <a
                    href={`mailto:${item.email}`}
                    className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
                  >
                    {item.email}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-6 text-sm leading-7 text-yellow-50">
              Las direcciones departamentales adicionales siguen en desarrollo y se ocultan de
              forma intencional hasta que estén plenamente operativas.
            </div>
          </section>
        </main>
      }
    />
  );
}
