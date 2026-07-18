import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_METHODS_CLARIFICATION,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export const metadata = {
  title: "Disclaimer | Edunancial",
  description:
    "Important legal disclaimers regarding Edunancial memberships, methods, certificates, and informational content.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">Legal</p>
        <h1 className="mt-4 text-5xl font-black">Disclaimer</h1>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
          <p>{EDUNANCIAL_IDENTITY}</p>
          <p className="mt-4">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
          <p className="mt-4">{EDUNANCIAL_METHODS_CLARIFICATION}</p>
        </div>

        <div className="mt-10 space-y-8 text-slate-300">
          <section>
            <h2 className="text-3xl font-black text-white">No Financial Advice</h2>
            <p className="mt-4 leading-8">
              Edunancial does not provide financial, investment, legal, tax, accounting,
              insurance, or other professional advice. Nothing on the platform should be treated
              as a recommendation to buy, sell, hold, or invest in any asset or venture.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">No Academic Institution</h2>
            <p className="mt-4 leading-8">{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Use of Methods</h2>
            <p className="mt-4 leading-8">{EDUNANCIAL_METHODS_CLARIFICATION}</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Risk and Responsibility</h2>
            <p className="mt-4 leading-8">
              All business, investment, borrowing, real-estate, and entrepreneurial decisions
              involve risk. Members are responsible for their own due diligence and should consult
              qualified professionals before acting.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
