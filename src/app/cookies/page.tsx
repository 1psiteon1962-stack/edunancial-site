import BilingualContent from "@/components/international/BilingualContent";

export const metadata = {
  title: "Cookie Policy | Edunancial",
  description: "Cookie Policy for Edunancial Financial Literacy Platform.",
};

export default function CookiePolicy() {
  return (
    <BilingualContent
      en={
        <main className="min-h-screen bg-[#08101f] text-white">
          <section className="mx-auto max-w-4xl px-6 py-20">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              Legal &amp; Compliance
            </p>
            <h1 className="mt-4 text-5xl font-black">Cookie Policy</h1>
            <p className="mt-6 text-slate-300 leading-8">
              Edunancial uses cookies and similar technologies to keep the North America site
              secure, remember preferences, and understand how members navigate the platform.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {[
                ["Functional preferences", "Language, region, currency, and experience settings."],
                ["Session management", "Secure sign-in state and protected member access."],
                ["Analytics", "Aggregated usage patterns that help us improve launch readiness."],
                ["Security", "Fraud prevention, rate limiting, and abuse detection controls."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-2xl font-black">{title}</h2>
                  <p className="mt-3 text-slate-300 leading-7">{body}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-slate-300 leading-8">
              Third-party services such as analytics, payment, and hosting providers may use their
              own cookies subject to their separate privacy notices.
            </p>
          </section>
        </main>
      }
      es={
        <main className="min-h-screen bg-[#08101f] text-white">
          <section className="mx-auto max-w-4xl px-6 py-20">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              Legal y cumplimiento
            </p>
            <h1 className="mt-4 text-5xl font-black">Política de cookies</h1>
            <p className="mt-6 text-slate-300 leading-8">
              Edunancial usa cookies y tecnologías similares para mantener seguro el sitio de
              Norteamérica, recordar preferencias y comprender cómo navegan los miembros.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {[
                ["Preferencias funcionales", "Idioma, región, moneda y configuración de experiencia."],
                ["Gestión de sesión", "Estado seguro de inicio de sesión y acceso protegido para miembros."],
                ["Analítica", "Patrones agregados de uso que nos ayudan a mejorar la preparación del lanzamiento."],
                ["Seguridad", "Controles de prevención de fraude, limitación de tasa y detección de abuso."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-2xl font-black">{title}</h2>
                  <p className="mt-3 text-slate-300 leading-7">{body}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-slate-300 leading-8">
              Servicios de terceros como proveedores de analítica, pagos y hosting pueden usar sus
              propias cookies sujetas a sus avisos de privacidad por separado.
            </p>
          </section>
        </main>
      }
    />
  );
}
