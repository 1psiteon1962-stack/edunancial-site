import Link from "next/link";

const investments = [
  "Budgeting",
  "Stocks",
  "ETFs",
  "Options",
  "Retirement",
  "Gold",
  "Silver",
  "Portfolio Management",
];

export default function InvestorCenter() {
  return (
    <section className="rounded-2xl bg-slate-900 p-10">

      <h2 className="text-4xl font-black">
        Investor Center
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {investments.map((item) => (
          <Link
            key={item}
            href="/investing"
            className="rounded-xl border border-slate-700 p-5 hover:bg-slate-800"
          >
            {item}
          </Link>
        ))}
      </div>

    </section>
  );
}
