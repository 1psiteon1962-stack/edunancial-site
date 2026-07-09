import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trust Center | Edunancial",
  description:
    "Edunancial Trust Center — our commitments to privacy, security, and compliance for users across the United States and Canada.",
  alternates: {
    canonical: "https://www.edunancial.com/trust-center",
  },
};

export default function TrustCenter() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">

        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400 mb-4">
          Trust &amp; Safety
        </p>
        <h1 className="text-5xl font-black mb-6">Trust Center</h1>
        <p className="text-xl text-slate-300 max-w-3xl mb-16">
          Edunancial is committed to earning and maintaining your trust. Here you&rsquo;ll find
          our commitments to privacy, security, and compliance — and how we honor them.
        </p>

        {/* Top 3 pillars */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          <div className="rounded-xl bg-slate-900 border border-slate-700 p-8">
            <div className="text-4xl mb-4">&#128274;</div>
            <h2 className="text-2xl font-black mb-3">Privacy</h2>
            <p className="text-slate-300 leading-7">
              We collect only what is necessary, never sell your data, and give you
              clear controls over your personal information.
            </p>
            <Link href="/privacy" className="mt-4 inline-block text-blue-400 underline text-sm">
              Read Privacy Policy &rarr;
            </Link>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-700 p-8">
            <div className="text-4xl mb-4">&#128737;</div>
            <h2 className="text-2xl font-black mb-3">Security</h2>
            <p className="text-slate-300 leading-7">
              Your data is protected by encryption in transit and at rest, role-based
              access controls, and regular security reviews.
            </p>
            <Link href="/security" className="mt-4 inline-block text-blue-400 underline text-sm">
              Read Security Overview &rarr;
            </Link>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-700 p-8">
            <div className="text-4xl mb-4">&#9989;</div>
            <h2 className="text-2xl font-black mb-3">Compliance</h2>
            <p className="text-slate-300 leading-7">
              We are designed to meet US and Canadian privacy law requirements,
              including CCPA/CPRA and Canadian PIPEDA / Quebec Law 25.
            </p>
            <Link href="/privacy#your-rights" className="mt-4 inline-block text-blue-400 underline text-sm">
              Your Rights &rarr;
            </Link>
          </div>
        </div>

        {/* Our Commitments */}
        <section className="mb-16">
          <h2 className="text-3xl font-black mb-8">Our Commitments</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: "&#128683;",
                title: "We never sell your data",
                body: "Your personal information is never sold to data brokers, advertisers, or third parties for their commercial use.",
              },
              {
                icon: "&#128221;",
                title: "Consent-first marketing",
                body: "We only send marketing emails with your explicit consent. You can unsubscribe from any email with one click.",
              },
              {
                icon: "&#128272;",
                title: "Minimum necessary data",
                body: "We collect only the data needed to provide our services. We do not build behavioral profiles for advertising.",
              },
              {
                icon: "&#128196;",
                title: "Clear policies",
                body: "Our Privacy Policy and Terms of Service are written to be understandable — not buried in legalese.",
              },
              {
                icon: "&#9201;",
                title: "Breach notification",
                body: "In the event of a data breach, we will notify affected users and relevant regulators as required by US and Canadian law.",
              },
              {
                icon: "&#128101;",
                title: "Role-based access",
                body: "Our team members access only the data necessary for their specific role. Access is logged and reviewed.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-slate-900 p-6 flex gap-4">
                <span className="text-3xl flex-shrink-0" dangerouslySetInnerHTML={{ __html: item.icon }} />
                <div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-300 text-sm leading-7">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Jurisdiction Coverage */}
        <section className="mb-16">
          <h2 className="text-3xl font-black mb-8">Jurisdiction Coverage</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-slate-900 border border-slate-700 p-8">
              <h3 className="text-xl font-black mb-4">&#127482;&#127480; United States</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>&#10003; California Consumer Privacy Act (CCPA)</li>
                <li>&#10003; California Privacy Rights Act (CPRA)</li>
                <li>&#10003; CAN-SPAM Act compliance</li>
                <li>&#10003; Children&rsquo;s Online Privacy Protection Act (COPPA)</li>
                <li>&#10003; State breach notification law compliance</li>
              </ul>
            </div>
            <div className="rounded-xl bg-slate-900 border border-slate-700 p-8">
              <h3 className="text-xl font-black mb-4">&#127464;&#127462; Canada</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>&#10003; Personal Information Protection and Electronic Documents Act (PIPEDA)</li>
                <li>&#10003; Quebec Law 25 / Act Respecting Protection of Personal Information</li>
                <li>&#10003; Canada&rsquo;s Anti-Spam Legislation (CASL)</li>
                <li>&#10003; Breach of Security Safeguards Regulations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Rights Request */}
        <section className="rounded-xl bg-blue-900/30 border border-blue-700 p-8 mb-12">
          <h2 className="text-2xl font-black mb-4">Exercise Your Data Rights</h2>
          <p className="text-slate-300 leading-7 mb-4">
            To access, correct, delete, or export your personal information — or to
            withdraw consent — contact our Privacy Officer:
          </p>
          <p className="text-slate-300">
            &#128231;{" "}
            <a href="mailto:privacy@edunancial.com" className="underline text-blue-400 font-bold">
              privacy@edunancial.com
            </a>
          </p>
          <p className="text-slate-300 mt-2">
            We respond to verifiable requests within 30 days (or within the legally
            required timeframe for your jurisdiction).
          </p>
        </section>

        {/* Related Links */}
        <div className="border-t border-slate-800 pt-8 text-sm text-slate-500">
          <p>
            Related:{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
            {" · "}
            <Link href="/terms" className="underline">Terms of Service</Link>
            {" · "}
            <Link href="/security" className="underline">Security</Link>
            {" · "}
            <Link href="/cookies" className="underline">Cookie Policy</Link>
            {" · "}
            <Link href="/disclaimer" className="underline">Disclaimer</Link>
          </p>
        </div>

      </div>
    </main>
  );
}
