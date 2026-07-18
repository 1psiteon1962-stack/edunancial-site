import Link from "next/link";

const paths = [
  ["Membership", "Recurring member access to competency education, assessments, and tools."],
  ["Courses", "Downloadable and guided financial education products."],
  ["Marketplace", "Trusted professional introductions as the ecosystem grows."],
  ["Business Tools", "Practical calculators, checklists, and operating templates."],
];

export const metadata = {
  title: "Edunancial Revenue Model | Membership, Courses, Marketplace",
  description:
    "Edunancial is structured around membership, financial competency courses, marketplace access, and practical financial tools.",
};

export default function RevenuePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">Revenue Model</p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Built to convert learning into membership revenue.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial is being designed as a membership-first financial competency platform with additional revenue from courses, tools, and marketplace services.
        </p>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:grid-cols-4">
        {paths.map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black">{title}</h2>
            <p className="mt-4 leading-7 text-slate-300">{body}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <Link href="/membership" className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700">
          View Membership Options
        </Link>
      </section>
    </main>
  );
}
