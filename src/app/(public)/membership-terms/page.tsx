import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export const metadata = {
  title: "Membership Terms | Edunancial",
  description:
    "Review Edunancial membership terms for individual members, approved organizations, beta testers, and billing expectations.",
};

export default function MembershipTermsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">Legal</p>
        <h1 className="mt-4 text-5xl font-black">Membership Terms</h1>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
          <p>{EDUNANCIAL_IDENTITY}</p>
          <p className="mt-4">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
        </div>

        <div className="mt-10 space-y-8 text-slate-300">
          <section>
            <h2 className="text-3xl font-black text-white">Basic Membership</h2>
            <p className="mt-4 leading-8">
              Basic Membership is offered at $24.99 per month and is designed for personal
              use by a single member account.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Pro Membership</h2>
            <p className="mt-4 leading-8">
              Pro Membership is priced at $39.99 per month and expands access to deeper learning,
              downloadable resources, and additional member support.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Gold Membership</h2>
            <p className="mt-4 leading-8">
              Gold Membership is priced at $59.99 per month and includes full advanced member
              access with premium support and tools.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Test Drive Access</h2>
            <p className="mt-4 leading-8">
              Test Drive access is $0, available for account onboarding, and does not auto-bill or
              auto-convert into a paid membership plan.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
