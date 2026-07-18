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
            <h2 className="text-3xl font-black text-white">Individual Membership</h2>
            <p className="mt-4 leading-8">
              Individual Membership is offered at $24.99 per month and is designed for personal
              use by a single member account.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Approved Organization Membership</h2>
            <p className="mt-4 leading-8">
              Approved Organization Membership is priced at $14.99 per member per month and is
              available only to approved partner organizations such as schools, nonprofits,
              community organizations, workforce programs, churches, youth organizations, and
              similar approved partners.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">100+ Member Organization Rate</h2>
            <p className="mt-4 leading-8">
              The 100+ Member Organization Rate is $9.99 per active paid member per month and
              requires a minimum of 100 active paid members plus a formal organizational agreement.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Beta Tester Access</h2>
            <p className="mt-4 leading-8">
              Beta Tester access is $0, invitation only, and not publicly listed as a membership
              plan. It never auto-bills or auto-converts into a paid plan.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
