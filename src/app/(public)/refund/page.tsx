import Link from "next/link";

import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export const metadata = {
  title: "Refund & Cancellation Policy | Edunancial",
  description:
    "Review Edunancial refund and cancellation rules for recurring memberships, digital access, organizations, and beta access.",
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">Legal</p>
        <h1 className="mt-4 text-5xl font-black">Refund &amp; Cancellation Policy</h1>
        <p className="mt-4 text-slate-400">Last updated: August 24, 2026</p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
          <p>{EDUNANCIAL_IDENTITY}</p>
          <p className="mt-4">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
        </div>

        <div className="mt-10 space-y-8 text-slate-300">
          <section>
            <h2 className="text-3xl font-black text-white">Cancel at Any Time</h2>
            <p className="mt-4 leading-8">
              Recurring memberships may be cancelled at any time through the cancellation method made
              available in the member account or by contacting Edunancial support. Cancellation prevents
              future renewals after it takes effect. Unless applicable law requires otherwise, paid access
              ordinarily continues through the end of the billing period already purchased.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Refund Requests</h2>
            <p className="mt-4 leading-8">
              Because Edunancial provides immediate access to digital educational content and member
              services, charges for a billing period that has begun are not automatically refundable.
              Refund requests are reviewed based on the circumstances, including duplicate or erroneous
              charges, technical inability to access purchased services, the amount of paid access already
              used, and any rights required by applicable law. Nothing in this policy limits a consumer
              right that cannot legally be waived.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Renewal Charges</h2>
            <p className="mt-4 leading-8">
              To avoid a renewal charge, cancel before the next renewal date. If you believe you were
              charged after a cancellation became effective, contact Edunancial promptly so the account
              and payment record can be reviewed.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Organizations and Special Agreements</h2>
            <p className="mt-4 leading-8">
              Enterprise, sponsored, or organizational purchases may be governed by a separate written
              agreement, order, invoice, or onboarding document. Where those terms conflict with this
              general policy, the applicable written agreement controls to the extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Free and Beta Access</h2>
            <p className="mt-4 leading-8">
              Test Drive and authorized Beta Tester access are free and do not generate an automatic
              charge solely because the free or beta period ends. A user must affirmatively enter a paid
              transaction or otherwise authorize paid recurring membership before Edunancial bills for a
              paid plan.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">How to Request Help</h2>
            <p className="mt-4 leading-8">
              Submit cancellation, refund, or billing questions through the Edunancial contact page. To
              help us locate the transaction, include the membership email and enough transaction detail
              to identify the charge, but do not send full payment-card numbers or account passwords.
            </p>
            <Link href="/contact" className="mt-3 inline-block text-blue-300 underline">
              Contact Edunancial
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
