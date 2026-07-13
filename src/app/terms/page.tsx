import Link from "next/link";

import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_METHODS_CLARIFICATION,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export const metadata = {
  title: "Terms of Use | Edunancial",
  description:
    "Review the Edunancial Terms of Use for membership access, acceptable use, disclaimers, and legal protections.",
};

const lastUpdated = "July 12, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">Legal</p>
        <h1 className="mt-4 text-5xl font-black">Terms of Use</h1>
        <p className="mt-4 text-slate-400">Last updated: {lastUpdated}</p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
          <p>{EDUNANCIAL_IDENTITY}</p>
          <p className="mt-4">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
          <p className="mt-4">{EDUNANCIAL_METHODS_CLARIFICATION}</p>
        </div>

        <div className="mt-10 space-y-10 text-slate-300">
          <section>
            <h2 className="text-3xl font-black text-white">1. Membership Platform Use</h2>
            <p className="mt-4 leading-8">
              By using Edunancial, you agree to use the platform only for lawful personal,
              household, or approved organizational purposes. You may access Edunancial through
              memberships, approved organizational arrangements, or invitation-only beta access
              where offered.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">2. No Academic or Professional Credential</h2>
            <p className="mt-4 leading-8">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">3. Financial, Legal, and Tax Disclaimer</h2>
            <p className="mt-4 leading-8">
              Edunancial provides informational content only. Nothing on the platform is legal,
              tax, accounting, investment, insurance, fiduciary, or financial advice, and nothing
              creates an advisor-client or similar professional relationship.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">4. Accounts and Security</h2>
            <p className="mt-4 leading-8">
              You are responsible for maintaining the confidentiality of your credentials and for
              all activity under your account. We may suspend or revoke access for fraud, abuse,
              unauthorized sharing, or violation of these Terms of Use.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">5. Payments and Billing</h2>
            <p className="mt-4 leading-8">
              Paid membership access is granted only after verified payment confirmation. Approved
              organization memberships and 100+ member organization rates may require manual review,
              approval, and formal organizational agreements before access or invoicing begins.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">6. Beta Access</h2>
            <p className="mt-4 leading-8">
              Beta Tester access is invitation only, personal to the approved email address,
              single-use, revocable, and limited in duration. See the{" "}
              <Link href="/beta-terms" className="underline text-blue-300">
                Beta Terms
              </Link>{" "}
              for additional details.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">7. Intellectual Property</h2>
            <p className="mt-4 leading-8">
              All Edunancial platform content, software, graphics, assessments, structured learning
              resources, and other materials are protected by applicable intellectual property laws.
              No license is granted except for your limited right to access the service as permitted
              by your membership.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">8. Limitation of Liability</h2>
            <p className="mt-4 leading-8">
              To the maximum extent permitted by law, Edunancial is not liable for indirect,
              incidental, special, consequential, or punitive damages, or for decisions you make
              using platform content, tools, or outputs.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">9. Contact</h2>
            <p className="mt-4 leading-8">
              Questions about these Terms of Use can be sent through our{" "}
              <Link href="/contact" className="underline text-blue-300">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
