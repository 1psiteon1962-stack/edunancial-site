import BilingualContent from "@/components/international/BilingualContent";

export const metadata = {
  title: "Cookie Policy | Edunancial",
  description: "Cookie Policy for Edunancial Financial Literacy Platform.",
};

function CookieLayout({
  label,
  title,
  intro,
  categories,
  footer,
}: {
  label: string;
  title: string;
  intro: string;
  categories: [string, string][];
  footer: string;
}) {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{label}</p>
        <h1 className="mt-4 text-5xl font-black">{title}</h1>
        <p className="mt-6 leading-8 text-slate-300">{intro}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {categories.map(([sectionTitle, body]) => (
            <div key={sectionTitle} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black">{sectionTitle}</h2>
              <p className="mt-3 leading-7 text-slate-300">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 leading-8 text-slate-300">{footer}</p>
      </section>
    </main>
  );
}

export default function CookiePolicy() {
  return (
    <BilingualContent
      en={
        <CookieLayout
          label="Legal & Compliance"
          title="Cookie Policy"
          intro="Edunancial uses cookies and similar technologies to keep the North America site secure, remember preferences, and understand how members navigate the platform."
          categories={[
            ["Functional preferences", "Language, region, currency, and experience settings."],
            ["Session management", "Secure sign-in state and protected member access."],
            ["Analytics", "Aggregated usage patterns that help us improve launch readiness."],
            ["Security", "Fraud prevention, rate limiting, and abuse detection controls."],
          ]}
          footer="Third-party services such as analytics, payment, and hosting providers may use their own cookies subject to their separate privacy notices."
        />
      }
      es={
        <CookieLayout
          label="Legal y cumplimiento"
          title="Política de cookies"
          intro="Edunancial usa cookies y tecnologías similares para mantener seguro el sitio de Norteamérica, recordar preferencias y comprender cómo navegan los miembros."
          categories={[
            ["Preferencias funcionales", "Idioma, región, moneda y configuración de experiencia."],
            ["Gestión de sesión", "Estado seguro de inicio de sesión y acceso protegido para miembros."],
            ["Analítica", "Patrones agregados de uso que nos ayudan a mejorar la preparación del lanzamiento."],
            ["Seguridad", "Controles de prevención de fraude, limitación de tasa y detección de abuso."],
          ]}
          footer="Servicios de terceros como proveedores de analítica, pagos y hosting pueden usar sus propias cookies sujetas a sus avisos de privacidad por separado."
        />
      }
      frCA={
        <CookieLayout
          label="Mentions légales et conformité"
          title="Politique relative aux témoins"
          intro="Edunancial utilise des témoins et des technologies similaires pour maintenir la sécurité du site en Amérique du Nord, mémoriser les préférences et comprendre la navigation des membres sur la plateforme."
          categories={[
            ["Préférences fonctionnelles", "Langue, région, devise et paramètres d'expérience."],
            ["Gestion des sessions", "État de connexion sécurisé et accès protégé des membres."],
            ["Analytique", "Schémas d'utilisation agrégés qui nous aident à améliorer la préparation au lancement."],
            ["Sécurité", "Contrôles de prévention de fraude, de limitation du débit et de détection des abus."],
          ]}
          footer="Les services tiers tels que les fournisseurs d'analytique, de paiement et d'hébergement peuvent utiliser leurs propres témoins soumis à leurs avis de confidentialité séparés."
        />
      }
      frFR={
        <CookieLayout
          label="Mentions légales et conformité"
          title="Politique relative aux cookies"
          intro="Edunancial utilise des cookies et des technologies similaires pour maintenir la sécurité du site en Amérique du Nord, mémoriser les préférences et comprendre la navigation des membres sur la plateforme."
          categories={[
            ["Préférences fonctionnelles", "Langue, région, devise et paramètres d'expérience."],
            ["Gestion des sessions", "État de connexion sécurisé et accès protégé des membres."],
            ["Analytique", "Schémas d'utilisation agrégés qui nous aident à améliorer la préparation au lancement."],
            ["Sécurité", "Contrôles de prévention de fraude, de limitation du débit et de détection des abus."],
          ]}
          footer="Les services tiers tels que les fournisseurs d'analytique, de paiement et d'hébergement peuvent utiliser leurs propres cookies soumis à leurs avis de confidentialité séparés."
        />
      }
    />
  );
}
