import {
  EDUNANCIAL_CONTENT_DISCLAIMER,
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_METHODS_CLARIFICATION,
  EDUNANCIAL_NO_RELATIONSHIP_DISCLAIMER,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export const metadata = {
  title: "Disclaimer | Edunancial",
  description:
    "Important legal disclaimers regarding Edunancial memberships, methods, certificates, AI tools, and informational, educational, and recreational content.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">Legal</p>
        <h1 className="mt-4 text-5xl font-black">Disclaimer</h1>
        <p className="mt-4 text-slate-400">Last updated: August 24, 2026</p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
          <p>{EDUNANCIAL_IDENTITY}</p>
          <p className="mt-4">{EDUNANCIAL_CONTENT_DISCLAIMER}</p>
          <p className="mt-4">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
          <p className="mt-4">{EDUNANCIAL_METHODS_CLARIFICATION}</p>
        </div>

        <div className="mt-10 space-y-8 text-slate-300">
          <section>
            <h2 className="text-3xl font-black text-white">Informational, Educational, and Recreational Purposes Only</h2>
            <p className="mt-4 leading-8">{EDUNANCIAL_CONTENT_DISCLAIMER}</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">No Professional Relationship</h2>
            <p className="mt-4 leading-8">{EDUNANCIAL_NO_RELATIONSHIP_DISCLAIMER}</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">No Financial, Investment, Tax, or Legal Advice</h2>
            <p className="mt-4 leading-8">
              Edunancial does not provide financial, investment, securities, brokerage, legal, tax,
              accounting, insurance, lending, credit-repair, real-estate brokerage, or other regulated
              professional advice. Nothing on the platform is an offer, recommendation, endorsement, or
              solicitation to buy, sell, hold, borrow against, finance, or invest in any security,
              property, business, digital asset, commodity, insurance product, loan, tax strategy, legal
              structure, or other transaction. Consult appropriately licensed or qualified professionals
              concerning your individual circumstances before acting.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Investment, Business, and Real-Estate Risk</h2>
            <p className="mt-4 leading-8">
              Investing, entrepreneurship, borrowing, credit use, and real-estate transactions involve
              risk, including possible loss of some or all capital, debt obligations, tax consequences,
              and other financial loss. Past performance, historical examples, hypothetical results,
              case studies, projections, and educational scenarios do not guarantee future results.
              Market conditions, laws, taxes, financing terms, and personal circumstances can change.
              Users are responsible for independent due diligence and their own decisions.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Examples, Calculators, and Simulations</h2>
            <p className="mt-4 leading-8">
              Calculators, formulas, projections, illustrations, simulations, sample transactions, and
              case studies may use assumptions or simplified facts for learning or recreational purposes.
              They are not appraisals, valuations, forecasts, tax calculations, legal conclusions,
              underwriting decisions, or promises that comparable terms or outcomes are available to any
              user. Independently verify all material facts and calculations before relying on them.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">No Earnings or Outcome Guarantee</h2>
            <p className="mt-4 leading-8">
              Edunancial does not promise or guarantee income, profits, investment returns, business
              success, financing approval, tax savings, credit improvement, employment, wealth creation,
              academic achievement, or any other financial, business, professional, or educational
              outcome. Testimonials, examples, success stories, and hypothetical scenarios are not
              guarantees that another user will obtain the same or similar result.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">AI and Automated Tools</h2>
            <p className="mt-4 leading-8">
              Artificial-intelligence and automated features may produce incomplete, inaccurate,
              misleading, or outdated information and may misunderstand a user&apos;s facts or jurisdiction.
              AI output is informational, educational, and/or recreational content only. It must not be
              treated as professional advice or relied upon as the sole basis for a financial, investment,
              tax, legal, business, credit, borrowing, insurance, or real-estate decision. Material
              information should be independently verified using current authoritative sources and, when
              appropriate, qualified professionals.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Third-Party Information, Professionals, and Links</h2>
            <p className="mt-4 leading-8">
              References or links to third-party products, professionals, attorneys, accountants,
              advisers, lenders, brokers, platforms, websites, data, or services are provided for
              informational, educational, recreational, or convenience purposes unless expressly stated
              otherwise. A reference does not by itself constitute an endorsement, professional referral,
              guarantee, or representation concerning licensing, qualifications, availability, pricing,
              accuracy, suitability, or results. Users should independently investigate third parties.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">No Academic Institution or Professional Credential</h2>
            <p className="mt-4 leading-8">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
            <p className="mt-4 leading-8">
              Any Edunancial certificate, badge, score, assessment result, financial passport entry, or
              completion recognition documents participation, completion, or platform-measured progress
              only. It does not establish professional qualification, competence for a regulated activity,
              licensure, accreditation, creditworthiness, investment sophistication, or legal authority to
              practice a profession.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Community, Mentors, and User-Generated Content</h2>
            <p className="mt-4 leading-8">
              Statements made by members, guests, mentors, speakers, community participants, or other
              third parties are their own and are not automatically statements or advice of Edunancial.
              Participation in a community, mentorship, webinar, discussion, or interactive feature does
              not transform educational information into professional advice or create a fiduciary or
              professional relationship.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Use of Educational Methods</h2>
            <p className="mt-4 leading-8">{EDUNANCIAL_METHODS_CLARIFICATION}</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Jurisdiction and Changing Rules</h2>
            <p className="mt-4 leading-8">
              Financial, tax, securities, business, consumer, credit, insurance, and real-estate rules
              vary by jurisdiction and change over time. Content may not reflect the law, regulation,
              market practice, tax treatment, or professional standard applicable to a particular user,
              transaction, country, state, province, territory, or municipality. Users should verify
              current requirements with authoritative governmental or regulatory sources and qualified
              professionals before acting.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">User Responsibility</h2>
            <p className="mt-4 leading-8">
              Users remain responsible for their own decisions, due diligence, professional consultations,
              filings, contracts, investments, purchases, borrowing, business activities, and compliance
              obligations. Edunancial content should be one learning resource among the sources a user
              considers, not the sole basis for a consequential decision.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
