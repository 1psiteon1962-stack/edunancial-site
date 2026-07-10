import Link from "next/link";

const featureGroups = [
  {
    title: "Public Dashboard",
    description: "A conversion-focused landing experience with fast access to every major part of the platform.",
  },
  {
    title: "Member Dashboard",
    description: "Personalized progress, saved resources, webinars, announcements, and next-lesson guidance.",
  },
  {
    title: "AI Financial Coach",
    description: "Guided support for questions, recommendations, and practical application.",
  },
  {
    title: "Courses & Learning Paths",
    description: "Structured education across real estate, financial assets, credit, and entrepreneurship.",
  },
  {
    title: "Financial Tools",
    description: "Assessments, calculators, templates, and decision-support resources for members.",
  },
  {
    title: "Resources & Community",
    description: "Downloads, books, events, webinars, and community pathways that reinforce action.",
  },
];

export const metadata = {
  title: "Features | Edunancial",
  description:
    "Explore the public dashboard, member dashboard, AI Financial Coach, and core Edunancial platform capabilities.",
};

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">Features</p>
        <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          A dashboard-first platform built for practical financial growth.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial combines clear navigation, member learning systems, AI assistance, and
          resource delivery so learners can go from discovery to action without friction.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureGroups.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-white/10 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-black">{feature.title}</h2>
              <p className="mt-4 leading-8 text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            href="/membership"
            className="rounded-xl bg-yellow-400 px-6 py-4 font-black text-slate-950 transition hover:bg-yellow-300"
          >
            Become a Member
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/20 px-6 py-4 font-bold transition hover:bg-white hover:text-slate-950"
          >
            Preview Member Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
