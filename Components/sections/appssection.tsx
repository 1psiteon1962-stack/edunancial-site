// components/sections/AppsSection.tsx
import Link from "next/link";

const apps = [
  {
    id: "edumath",
    name: "EduMath",
    badge: "Math for Money",
    description:
      "Learn the math behind money, business, and investing — percentages, compounding, margins, and KPIs explained clearly.",
    highlight: "Perfect for teens, students, and new investors.",
    href: "/edumath",
  },
  {
    id: "edunancial-edge",
    name: "Edunancial Edge",
    badge: "Business KPIs & Diagnostics",
    description:
      "See how your business really performs. Track KPIs, margins, drivers, and growth in a way that beginners can understand.",
    highlight: "Built for entrepreneurs and small business owners.",
    href: "/edge",
  },
];

export default function AppsSection() {
  return (
    <section className="bg-slate-50 py-16" id="apps">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              Edunancial Apps
            </h2>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              Two engines to help you see clearly.
            </h3>
          </div>
          <p className="max-w-md text-sm text-slate-600">
            Start with the math, then move into business diagnostics. Each tool
            is designed to be simple enough for beginners, and strong enough to
            grow with you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {apps.map((app) => (
            <div
              key={app.id}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl hover:ring-blue-500/40"
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xl font-bold text-slate-900">
                  {app.name}
                </h4>
                <span className="rounded-full bg-blue-600/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                  {app.badge}
                </span>
              </div>
              <p className="mb-2 text-sm text-slate-700">
                {app.description}
              </p>
              <p className="mb-4 text-xs font-semibold text-slate-500">
                {app.highlight}
              </p>
              <Link
                href={app.href}
                className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-500"
              >
                Learn more
                <span className="ml-1 inline-block transition group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
