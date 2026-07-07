import Link from "next/link";

const modules = [
  "Start a Business",
  "Business Planning",
  "Pricing",
  "Cash Flow",
  "KPIs",
  "Hiring",
  "Marketing",
  "Scaling",
];

export default function BusinessLaunchCenter() {
  return (
    <section className="rounded-2xl bg-blue-950 p-10">

      <h2 className="text-4xl font-black">
        Business Launch Center
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <Link
            key={module}
            href="/business"
            className="rounded-xl bg-slate-900 p-5 hover:bg-slate-800"
          >
            {module}
          </Link>
        ))}
      </div>

    </section>
  );
}
