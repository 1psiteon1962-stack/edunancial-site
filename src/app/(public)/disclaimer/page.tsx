import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_METHODS_CLARIFICATION,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export const metadata = {
  title: "Disclaimer | Edunancial",
  description:
    "Important legal disclaimers regarding Edunancial memberships, methods, certificates, AI tools, and educational content.",
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
          <p className="mt-4">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
          <p className="mt-4">{EDUNANCIAL_METHODS_CLARIFICATION}</p>
        </div>

        <div className="mt-10 space-y-8 text-slate-300">
          <section>
            <h2 className="text-3xl font-black text-white">Education and Information Only</h2>
            <p className="mt-4 leading-8">
              Edunancial provides general educational and informational content. Content, examples,
              calculators, scenarios, assessments, tools, community discussions, and AI-generated
              responses are not individualized professional advice and do not create an advisor,
              fiduciary, attorney-client, accountant-client, broker-client, or similar professional
              relationship.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">No Financial, Investment, Tax, or Legal Advice</h2>
            <p className="mt-4 leading-8">
              Edunancial does not provide financial, investment, securities, brokerage, legal, tax,
              accounting, insurance, lending, or other regulated professional advice. Nothing on the
              platform is a recommendation or solicitation to buy, sell, hold, borrow against, finance,
              or invest in any security, property, business, digital asset, commodity, insurance product,
              loan, or other transaction. Consult appropriately licensed or qualified professionals for
              advice concerning your individual circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Investment, Business, and Real-Estate Risk</h2>
            <p className="mt-4 leading-8">
              Investing, entrepreneurship, borrowing, and real-estate transactions involve risk,
              including possible loss of principal or other capital. Past performance, historical
              examples, hypothetical results, case studies, projections, and educational scenarios do
              not guarantee future results. Market conditions, laws, taxes, financing terms, and personal
              circumstances can change. Members are responsible for independent due diligence and their
              own decisions.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">No Earnings or Outcome Guarantee</h2>
            <p className="mt-4 leading-8">
              Edunancial does not promise or guarantee income, profits, investment returns, business
              success, financing approval, tax savings, credit improvement, employment, wealth creation,
              or any other financial or educational outcome. Results depend on many factors outside
              Edunancial&apos;s control, including individual effort, decisions, experience, market conditions,
              and professional advice obtained by the member.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">AI and Automated Tools</h2>
            <p className="mt-4 leading-8">
              Artificial-intelligence and automated features may produce incomplete, inaccurate, or
              outdated information. AI output must not be treated as professional advice or relied upon
              as the sole basis for a financial, investment, tax, legal, business, credit, borrowing, or
              real-estate decision. Important information should be independently verified.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Third-Party Information and Links</h2>
            <p className="mt-4 leading-8">
              References or links to third-party products, professionals, lenders, brokers, platforms,
              websites, data, or services are provided for educational or convenience purposes unless
              expressly stated otherwise. A reference does not by itself constitute an endorsement or
              guarantee. Third parties control their own content, terms, privacy practices, pricing, and
              services.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">No Academic Institution or Professional Credential</h2>
            <p className="mt-4 leading-8">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
            <p className="mt-4 leading-8">
              Any Edunancial certificate or completion recognition documents participation or completion
              only. It does not establish professional qualification, licensure, accreditation, or legal
              authority to practice a regulated profession.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Use of Educational Methods</h2>
            <p className="mt-4 leading-8">{EDUNANCIAL_METHODS_CLARIFICATION}</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Jurisdiction and Changing Rules</h2>
            <p className="mt-4 leading-8">
              Financial, tax, securities, business, consumer, and real-estate rules vary by jurisdiction
              and change over time. Educational material may not reflect the law or practice applicable
              to a particular member, transaction, country, state, province, territory, or municipality.
              Members should verify current requirements with appropriate governmental sources and
              qualified professionals before acting.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
