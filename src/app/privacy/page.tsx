import type { Metadata } from "next";
import Link from "next/link";
import BilingualContent from "@/components/international/BilingualContent";
import { EDUNANCIAL_IDENTITY, EDUNANCIAL_PUBLIC_DISCLAIMER } from "@/lib/positioning";

export const metadata: Metadata = {
  title: "Privacy Policy | Edunancial",
  description:
    "Edunancial Privacy Policy — learn how we collect, use, and protect your personal information. Covers US (CCPA/CPRA), Canada (PIPEDA), and Quebec (Law 25) requirements.",
  alternates: {
    canonical: "https://www.edunancial.com/privacy",
  },
};

const lastUpdated = "July 9, 2026";

export default function PrivacyPage() {
  return (
    <BilingualContent
      en={
        <main className="min-h-screen bg-[#08101f] text-white">
          <div className="mx-auto max-w-4xl px-6 py-20">

            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400 mb-4">
              Legal &amp; Compliance
            </p>
            <h1 className="text-5xl font-black mb-4">Privacy Policy</h1>
            <p className="text-slate-400 mb-12">
              <strong>Last Updated:</strong> {lastUpdated} &nbsp;|&nbsp;
              <strong>Effective Date:</strong> {lastUpdated}
            </p>

            <div className="rounded-xl bg-blue-900/30 border border-blue-700 p-6 mb-12">
              <p className="text-blue-200 text-sm">
                <strong>Plain-language summary:</strong> Edunancial collects only the information
                needed to provide membership services. We never sell your personal information.
                You have the right to access, correct, or delete your data. We honor requests
                from California residents under CCPA/CPRA, Canadian residents under PIPEDA,
                and Quebec residents under Law 25.
              </p>
            </div>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-4">1. Who We Are</h2>
          <p className="text-slate-300 leading-8">
            Edunancial (&ldquo;Edunancial,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;) is a financial literacy and financial competency membership
            platform serving individuals, families, entrepreneurs, and business owners.
          </p>
          <p className="mt-4 text-slate-300 leading-8">{EDUNANCIAL_IDENTITY}</p>
          <p className="mt-4 text-slate-300 leading-8">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
          <p className="mt-4 text-slate-300 leading-8">
            Our platform is available at{" "}
            <Link href="https://www.edunancial.com" className="underline text-blue-400">
              www.edunancial.com
            </Link>
            . For privacy questions or data requests, contact us at:{" "}
            <a href="mailto:privacy@edunancial.com" className="underline text-blue-400">
              privacy@edunancial.com
            </a>
            .
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-4">2. Information We Collect</h2>
          <p className="text-slate-300 leading-8 mb-4">
            We collect information you provide directly and information generated through your use of our platform:
          </p>
          <h3 className="text-xl font-bold mb-3 text-white">Information You Provide</h3>
          <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-6">
            <li>Name and email address (account registration)</li>
            <li>Country and region/state/province of residence</li>
            <li>Membership and billing information (processed by our payment providers)</li>
            <li>Member progress and assessment responses</li>
            <li>Communications you send us (support requests, feedback)</li>
            <li>Voluntary profile information (business type, learning goals)</li>
          </ul>
          <h3 className="text-xl font-bold mb-3 text-white">Automatically Collected Information</h3>
          <ul className="list-disc pl-8 text-slate-300 space-y-2">
            <li>Device type, browser, and operating system</li>
            <li>IP address and approximate location (country/region level)</li>
            <li>Pages visited, time on page, and navigation patterns</li>
            <li>Referring URLs</li>
            <li>Cookie and session identifiers (see Section 7)</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-4">3. How We Use Your Information</h2>
          <p className="text-slate-300 leading-8 mb-4">We use your information to:</p>
          <ul className="list-disc pl-8 text-slate-300 space-y-2">
            <li>Create and manage your account</li>
            <li>Deliver learning resources, assessments, and membership content</li>
            <li>Process membership subscriptions and payments</li>
            <li>Send transactional emails (receipts, onboarding confirmations, beta notices)</li>
            <li>Send membership newsletters and learning updates (with your consent)</li>
            <li>Improve and personalize platform features</li>
            <li>Provide customer support</li>
            <li>Comply with legal obligations</li>
            <li>Detect and prevent fraud and security incidents</li>
          </ul>
          <p className="mt-6 text-slate-300 leading-8">
            <strong>We do not use your information for</strong> automated decision-making
            that produces legal or similarly significant effects without human review.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-4">4. How We Share Your Information</h2>
          <p className="text-slate-300 leading-8 mb-4">
            <strong>We never sell your personal information.</strong>
          </p>
          <p className="text-slate-300 leading-8 mb-4">We may share information with:</p>
          <ul className="list-disc pl-8 text-slate-300 space-y-2">
            <li>
              <strong>Service providers</strong> who operate under data processing agreements
              and are contractually prohibited from using your data for their own purposes
              (hosting, payment processing, email delivery, analytics)
            </li>
            <li>
              <strong>Legal authorities</strong> when required by law, court order, or
              to protect the rights and safety of our users and the public
            </li>
            <li>
              <strong>Business successors</strong> in the event of a merger, acquisition,
              or sale of assets, subject to the same privacy protections
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-4">5. Your Privacy Rights</h2>

          <div className="rounded-xl bg-slate-900 p-6 mb-6">
            <h3 className="text-xl font-bold mb-3 text-yellow-400">All Users</h3>
            <p className="text-slate-300 leading-8">
              Regardless of your location, you have the right to:
            </p>
            <ul className="list-disc pl-6 mt-3 text-slate-300 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate personal information</li>
              <li>Delete your account and personal information</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
          </div>

          <div className="rounded-xl bg-slate-900 p-6 mb-6">
            <h3 className="text-xl font-bold mb-3 text-red-400">
              California Residents (CCPA / CPRA)
            </h3>
            <p className="text-slate-300 leading-8 mb-3">
              If you are a California resident, you have additional rights under the
              California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Right to know what personal information is collected, used, shared, or sold</li>
              <li>Right to delete personal information</li>
              <li>Right to opt out of the sale or sharing of personal information (we do not sell)</li>
              <li>Right to correct inaccurate personal information</li>
              <li>Right to limit use of sensitive personal information</li>
              <li>Right to non-discrimination for exercising these rights</li>
            </ul>
            <p className="mt-4 text-slate-300">
              To submit a verifiable consumer request, email{" "}
              <a href="mailto:privacy@edunancial.com" className="underline text-blue-400">
                privacy@edunancial.com
              </a>{" "}
              with &ldquo;California Privacy Request&rdquo; in the subject line.
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-6 mb-6">
            <h3 className="text-xl font-bold mb-3 text-blue-400">
              Canadian Residents (PIPEDA / Quebec Law 25)
            </h3>
            <p className="text-slate-300 leading-8 mb-3">
              If you are a Canadian resident, we handle your personal information in accordance
              with the Personal Information Protection and Electronic Documents Act (PIPEDA)
              and, where applicable, Quebec&rsquo;s Act Respecting the Protection of Personal
              Information in the Private Sector (Law 25 / Bill 64).
            </p>
            <p className="text-slate-300 leading-8 mb-3">
              Your rights include:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Access to personal information we hold about you</li>
              <li>Correction of inaccurate information</li>
              <li>Withdrawal of consent (may affect service availability)</li>
              <li>
                For Quebec residents: right to data portability, right to be de-indexed
                from search results where applicable, and right to object to automated
                decisions
              </li>
            </ul>
            <p className="mt-4 text-slate-300">
              To exercise your rights, contact{" "}
              <a href="mailto:privacy@edunancial.com" className="underline text-blue-400">
                privacy@edunancial.com
              </a>{" "}
              with &ldquo;Canadian Privacy Request&rdquo; in the subject line.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-4">6. Data Retention</h2>
          <p className="text-slate-300 leading-8">
            We retain your personal information for as long as your account is active or
            as needed to provide services. We also retain data as required by law or
            legitimate business purposes (e.g., financial records, fraud prevention).
            Upon account deletion request, we will delete or anonymize your personal
            information within 30 days, except where retention is required by law.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-4">7. Cookies &amp; Tracking</h2>
          <p className="text-slate-300 leading-8 mb-4">
            We use cookies and similar technologies to operate and improve our platform.
            Types of cookies we use:
          </p>
          <ul className="list-disc pl-8 text-slate-300 space-y-2">
            <li>
              <strong>Strictly necessary:</strong> Required for login, security, and
              basic platform functionality. Cannot be disabled.
            </li>
            <li>
              <strong>Functional:</strong> Remember your preferences and settings.
            </li>
            <li>
              <strong>Analytics:</strong> Help us understand how the platform is used
              (aggregated, non-identifying data). Require your consent.
            </li>
            <li>
              <strong>Marketing:</strong> Used only with your explicit consent.
            </li>
          </ul>
          <p className="mt-4 text-slate-300 leading-8">
            You can manage cookie preferences through our cookie settings banner or
            your browser settings. Disabling non-essential cookies will not affect
            your ability to access core platform features.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-4">8. Data Security</h2>
          <p className="text-slate-300 leading-8">
            We implement technical and organizational security measures appropriate to
            the risk, including:
          </p>
          <ul className="list-disc pl-8 mt-4 text-slate-300 space-y-2">
            <li>Encryption in transit (TLS) and at rest for sensitive data</li>
            <li>Role-based access controls — staff access only what is needed</li>
            <li>Regular security reviews and updates</li>
            <li>Third-party service providers who meet security standards</li>
            <li>Breach notification procedures in compliance with applicable law</li>
          </ul>
          <p className="mt-4 text-slate-300 leading-8">
            In the event of a data breach affecting your personal information, we will
            notify affected users and relevant authorities as required by applicable law
            (including PIPEDA breach of security safeguards requirements and applicable
            US state notification laws).
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-4">9. Children&rsquo;s Privacy</h2>
          <p className="text-slate-300 leading-8">
            Our platform is not directed to children under 13 (or under 16 in Quebec).
            We do not knowingly collect personal information from children without verifiable
            parental consent. If you believe we have collected information from a child,
            please contact us at{" "}
            <a href="mailto:privacy@edunancial.com" className="underline text-blue-400">
              privacy@edunancial.com
            </a>
            .
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-4">10. International Data Transfers</h2>
          <p className="text-slate-300 leading-8">
            Edunancial primarily stores and processes data in the United States.
            If you access our platform from Canada or other jurisdictions, your data
            may be transferred to and processed in the US. We take steps to ensure
            adequate protections are in place for such transfers consistent with
            applicable law.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-4">11. Changes to This Policy</h2>
          <p className="text-slate-300 leading-8">
            We may update this Privacy Policy from time to time. When we make material
            changes, we will notify you by email (if we have your address) and by posting
            a notice on this page with an updated effective date. Continued use of our
            platform after the effective date constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-4">12. Contact Us</h2>
          <p className="text-slate-300 leading-8">
            For privacy questions, data access requests, or to exercise your rights:
          </p>
          <div className="mt-4 rounded-xl bg-slate-900 p-6 text-slate-300">
            <p><strong>Privacy Officer</strong></p>
            <p>Edunancial</p>
            <p>
              Email:{" "}
              <a href="mailto:privacy@edunancial.com" className="underline text-blue-400">
                privacy@edunancial.com
              </a>
            </p>
            <p>
              Web:{" "}
              <Link href="/contact" className="underline text-blue-400">
                www.edunancial.com/contact
              </Link>
            </p>
          </div>
        </section>

            <div className="border-t border-slate-800 pt-8 text-sm text-slate-500">
              <p>
                Related policies:{" "}
                <Link href="/terms" className="underline">Terms of Use</Link>
                {" · "}
                <Link href="/cookies" className="underline">Cookie Policy</Link>
                {" · "}
                <Link href="/disclaimer" className="underline">Disclaimer</Link>
                {" · "}
                <Link href="/trust-center" className="underline">Trust Center</Link>
              </p>
            </div>

          </div>
        </main>
      }
      es={
        <main className="min-h-screen bg-[#08101f] text-white">
          <div className="mx-auto max-w-4xl px-6 py-20">
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400 mb-4">
              Legal y cumplimiento
            </p>
            <h1 className="text-5xl font-black mb-4">Privacidad</h1>
            <p className="text-slate-300 leading-8">
              Edunancial recopila únicamente la información necesaria para ofrecer membresías,
              progreso de aprendizaje y soporte. No vendemos información personal y respetamos las
              solicitudes de acceso, corrección y eliminación de datos para miembros de
              Norteamérica.
            </p>

            <div className="mt-10 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-6 text-slate-200">
              <p className="font-semibold text-blue-200">
                Revisión legal en español en progreso
              </p>
              <p className="mt-3 leading-7">
                La versión completa en español de la política de privacidad para Norteamérica está
                bajo revisión legal y de cumplimiento. Mientras tanto, puede usar esta página como
                resumen operativo y comunicarse con{" "}
                <a href="mailto:privacy@edunancial.com" className="underline text-blue-300">
                  privacy@edunancial.com
                </a>{" "}
                si necesita ayuda específica de privacidad.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {[
                ["Qué recopilamos", "Datos de cuenta, preferencias, progreso, pagos verificados y solicitudes de soporte."],
                ["Cómo lo usamos", "Prestación de servicios, seguridad, soporte, pagos y mejora del producto."],
                ["Qué no hacemos", "No vendemos información personal ni activamos membresías sin verificación del servidor."],
                ["Sus opciones", "Puede solicitar acceso, corrección o eliminación de datos y retirar el consentimiento aplicable."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-2xl font-black">{title}</h2>
                  <p className="mt-3 leading-7 text-slate-300">{body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm leading-7 text-slate-300">
              <p><strong>Identidad de la plataforma:</strong> {EDUNANCIAL_IDENTITY}</p>
              <p className="mt-4"><strong>Descargo público:</strong> {EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
            </div>
          </div>
        </main>
      }
    />
  );
}
