import dynamic from "next/dynamic";
import Link from "next/link";

export const metadata = {
  title: "Financial Competency Dashboard | Edunancial",
  description: "Track your Financial Competency journey.",
};

const DashboardSecondaryPanels = dynamic(
  () => import("@/components/dashboard/DashboardSecondaryPanels")
);

const metricCards = [
  { label: "Overall Score", value: "82", className: "bg-blue-700" },
  { label: "Courses Completed", value: "14", className: "bg-red-700" },
  { label: "Learning Hours", value: "39", className: "bg-green-700" },
  { label: "Certificates", value: "6", className: "bg-yellow-600" },
] as const;

const competencyProgress = [
  { label: "Personal Finance", value: 91, barClassName: "bg-green-500" },
  { label: "Real Estate", value: 76, barClassName: "bg-red-500" },
  { label: "Paper Assets", value: 84, barClassName: "bg-white" },
  { label: "Business", value: 95, barClassName: "bg-blue-500" },
] as const;

const actions = [
  {
    href: "/courses",
    label: "Continue Learning",
    className: "rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700",
  },
  {
    href: "/assessment",
    label: "Retake Assessment",
    className:
      "rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black",
  },
  {
    href: "/marketplace",
    label: "Visit Marketplace",
    className:
      "rounded-xl border border-green-500 px-10 py-5 text-xl font-bold hover:bg-green-600",
  },
] as const;

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">MEMBER DASHBOARD</p>

        <h1 className="mt-8 text-7xl font-black">Financial Competency Dashboard</h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Monitor your progress. Complete courses. Improve your Financial Competency Score. Build
          wealth through continuous learning.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-4">
          {metricCards.map((card) => (
            <div key={card.label} className={`rounded-2xl p-10 text-center ${card.className}`}>
              <p className="text-lg uppercase">{card.label}</p>
              <h2 className="mt-6 text-6xl font-black">{card.value}</h2>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-2xl bg-slate-900 p-10">
          <h2 className="text-4xl font-black">Financial Competency Progress</h2>

          <div className="mt-10 space-y-8">
            {competencyProgress.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>

                <div className="mt-3 h-4 rounded-full bg-slate-700">
                  <div
                    className={`h-4 rounded-full ${item.barClassName}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <DashboardSecondaryPanels />

        <div className="mt-20 flex flex-wrap gap-6">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className={action.className}>
              {action.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
