export const metadata = {
  title: "Investor Readiness Assessment | Edunancial",
};

const categories = [
  "Emergency Savings",
  "Budgeting",
  "Credit",
  "Debt Management",
  "Risk Tolerance",
  "Retirement Planning",
  "Stocks & ETFs",
  "Real Estate",
  "Business Ownership",
  "Long-Term Wealth Building",
];

export default function InvestorReadinessPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h1 className="text-6xl font-black">
          Investor Readiness Assessment
        </h1>

        <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
          Before choosing investments, determine whether your financial
          foundation is strong enough to support long-term investing.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2">

          {categories.map((item) => (
            <div
              key={item}
              className="rounded-xl bg-slate-900 p-8"
            >
              <h2 className="text-2xl font-bold">
                {item}
              </h2>
            </div>
          ))}

        </div>

      </section>

    </main>
  );
}
