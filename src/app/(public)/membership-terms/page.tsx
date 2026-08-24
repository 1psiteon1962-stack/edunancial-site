import Link from "next/link";

import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export const metadata = {
  title: "Membership Terms | Edunancial",
  description:
    "Review Edunancial membership terms for plan access, recurring billing, cancellation, refunds, and beta access.",
};

export default function MembershipTermsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">Legal</p>
        <h1 className="mt-4 text-5xl font-black">Membership Terms</h1>
        <p className="mt-4 text-slate-400">Last updated: August 24, 2026</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
          <p>{EDUNANCIAL_IDENTITY}</p>
          <p className="mt-4">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
        </div>

        <div className="mt-10 space-y-8 text-slate-300">
          <section>
            <h2 className="text-3xl font-black text-white">Plans and Access</h2>
            <p className="mt-4 leading-8">
              Basic Membership is $39.99 per month, Pro Membership is $69.99 per month, and Gold
              Membership is $99.99 per month. The features and curriculum available to each tier are
              those displayed on Edunancial at the time of purchase, subject to reasonable updates to
              the platform. Test Drive access is $0 and does not automatically convert into a paid plan.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Recurring Billing Authorization</h2>
            <p className="mt-4 leading-8">
              When you purchase a recurring membership, you authorize Edunancial and its payment
              processor to charge the payment method you provide at the price and billing interval
              disclosed at checkout, plus applicable taxes, until you cancel. Monthly memberships renew
              approximately monthly. Any annual membership offered at checkout renews approximately
              annually. The checkout screen controls if its price or interval differs from older
              promotional or informational material.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Cancellation</h2>
            <p className="mt-4 leading-8">
              You may cancel a recurring membership at any time through the cancellation method made
              available in your account or by contacting Edunancial support. Cancellation stops future
              renewals and ordinarily takes effect at the end of the then-current paid billing period,
              unless applicable law requires otherwise. Cancel before the next renewal date to avoid the
              next recurring charge.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Failed Payments and Access</h2>
            <p className="mt-4 leading-8">
              If a recurring payment fails or is reversed, Edunancial may retry the charge where
              permitted, request an updated payment method, suspend paid access, or return the account to
              an available free tier until payment is resolved. Edunancial will not intentionally charge
              a cancelled membership for a new renewal after cancellation has taken effect.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Refunds</h2>
            <p className="mt-4 leading-8">
              Payments and refund requests are governed by the Edunancial Refund Policy and any
              non-waivable rights provided by applicable law. Cancellation by itself does not necessarily
              create a refund for time already billed or digital access already provided.
            </p>
            <Link href="/refund" className="mt-3 inline-block text-blue-300 underline">
              Review the Refund Policy
            </Link>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Taxes and Currency</h2>
            <p className="mt-4 leading-8">
              Prices are displayed in the currency shown at checkout. Applicable sales, use, value-added,
              goods-and-services, or similar taxes may be added where required. Currency conversion or
              card-issuer fees, if any, are controlled by the member&apos;s financial institution or payment
              provider.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Account Responsibility</h2>
            <p className="mt-4 leading-8">
              Membership access is for the authorized account holder unless an organizational agreement
              expressly provides otherwise. Members are responsible for maintaining accurate account and
              payment information and for protecting their login credentials. Accounts and paid access
              may not be resold, transferred, or shared in a manner that circumvents membership limits.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">No Guaranteed Results</h2>
            <p className="mt-4 leading-8">
              Membership provides access to educational resources and tools; it does not guarantee
              earnings, investment performance, business success, financing, tax savings, credit results,
              employment, professional licensure, or any other financial or educational outcome.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Organization and Beta Access</h2>
            <p className="mt-4 leading-8">
              Enterprise or organization access may be governed by a separate written agreement, order,
              invoice, or onboarding document. Beta Tester access is free and invitation only; expiration
              of beta access does not itself create a charge or automatically enroll the tester in a paid
              membership.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
