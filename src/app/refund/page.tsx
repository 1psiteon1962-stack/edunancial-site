import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export const metadata = {
  title: "Refund Policy | Edunancial",
  description:
    "Review Edunancial refund rules for memberships, approved organizations, and beta tester access.",
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">Legal</p>
        <h1 className="mt-4 text-5xl font-black">Refund Policy</h1>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
          <p>{EDUNANCIAL_IDENTITY}</p>
          <p className="mt-4">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
        </div>

        <div className="mt-10 space-y-8 text-slate-300">
          <section>
            <h2 className="text-3xl font-black text-white">Monthly Memberships</h2>
            <p className="mt-4 leading-8">
              Individual memberships may be cancelled at any time. Refund requests for the current
              billing period are reviewed case by case, especially where verified access to paid
              digital resources has already been delivered.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Approved Organizations</h2>
            <p className="mt-4 leading-8">
              Approved Organization Memberships and 100+ Member Organization Rates are governed by
              the applicable organizational agreement, invoice terms, and onboarding documentation.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Beta Tester Access</h2>
            <p className="mt-4 leading-8">
              Beta Tester access is free, invitation only, and never generates an automatic charge.
              Expiration does not create a billing event or auto-convert the tester into a paid
              member.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Contact</h2>
            <p className="mt-4 leading-8">
              Submit refund requests or billing questions through the Edunancial contact page or by
              emailing info@edunancial.com.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
