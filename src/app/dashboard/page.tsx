import Link from "next/link";

import { currentUser } from "@/lib/auth";

const learningProgress = [
  { label: "Financial Foundations", value: 84, color: "bg-green-500" },
  { label: "Credit & Cash Flow", value: 68, color: "bg-yellow-400" },
  { label: "Real Estate", value: 52, color: "bg-red-500" },
  { label: "Business Growth", value: 73, color: "bg-blue-500" },
];

const recentlyViewed = [
  {
    title: "Credit Fundamentals",
    detail: "Recently viewed in WHITE track",
    href: "/courses/white",
  },
  {
    title: "Tax Lien Basics",
    detail: "Resume your real estate lesson",
    href: "/courses/red",
  },
  {
    title: "Pricing & Profit",
    detail: "Continue your BLUE track workshop",
    href: "/courses/blue",
  },
];

const financialTools = [
  { title: "Financial Tools", detail: "Calculators and decision aids", href: "/financial-tools" },
  { title: "Assessment", detail: "Refresh your competency baseline", href: "/assessment" },
  { title: "Continue Learning", detail: "Jump back into active study", href: "/continue-learning" },
];

const savedResources = [
  { title: "Saved Resources", detail: "Bookmarks, downloads, and notes", href: "/favorites" },
  { title: "Download Center", detail: "Worksheets, templates, and guides", href: "/downloads" },
  { title: "Certificates", detail: "Review completed milestones", href: "/my-certificates" },
];

const upcomingEvents = [
  { title: "Live webinar: Build a family wealth plan", date: "Tue • 7:00 PM", href: "/webinars" },
  { title: "Member Q&A with the AI Coach", date: "Thu • 1:00 PM", href: "/events" },
  { title: "Business KPI office hours", date: "Sat • 11:00 AM", href: "/webinars" },
];

const announcements = [
  "New dashboard navigation makes every major member tool reachable in two clicks or less.",
  "The AI Financial Coach is now featured directly from both the public and member dashboards.",
  "Pricing, features, privacy, FAQ, and contact information are now available as dedicated pages.",
];

export const metadata = {
  title: "Member Dashboard | Edunancial",
  description:
    "Track progress, resume learning, access tools, and stay connected with upcoming member resources.",
};

export default function DashboardPage() {
  const user = currentUser();
  const firstName = user?.firstName ?? "Member";

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-[#132347] p-8 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
              Welcome Back
            </p>
            <h1 className="mt-4 text-4xl font-black md:text-6xl">
              {firstName}, your member dashboard is ready.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Pick up where you left off, check your learning momentum, and move directly to
              the tools and resources that support your next financial decision.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/continue-learning"
                className="rounded-xl bg-yellow-400 px-6 py-4 font-black text-slate-950 transition hover:bg-yellow-300"
              >
                Resume Learning
              </Link>
              <Link
                href="/ai-coach"
                className="rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700"
              >
                Open AI Financial Coach
              </Link>
              <Link
                href="/my-courses"
                className="rounded-xl border border-white/20 px-6 py-4 font-bold text-white transition hover:bg-white hover:text-slate-950"
              >
                My Courses
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ["Learning Streak", "12 days"],
              ["Courses In Progress", "4 active"],
              ["Saved Resources", "18 items"],
              ["Upcoming Events", "3 scheduled"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{label}</p>
                <p className="mt-4 text-3xl font-black">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl font-black">Learning Progress</h2>
              <Link href="/course-progress" className="font-bold text-blue-300 hover:text-blue-200">
                Full progress &rarr;
              </Link>
            </div>
            <div className="mt-8 space-y-6">
              {learningProgress.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-300">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-slate-700">
                    <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-8">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-blue-300">
              Recommended Next Lesson
            </p>
            <h2 className="mt-4 text-3xl font-black">Strengthen your real estate decision-making</h2>
            <p className="mt-5 text-base leading-8 text-slate-200">
              Your latest activity shows strong momentum in budgeting and business. The best next
              step is to improve your real estate track with a lesson on tax liens, due diligence,
              and evaluating opportunity cost.
            </p>
            <Link
              href="/courses/red"
              className="mt-8 inline-flex rounded-xl bg-white px-6 py-4 font-black text-slate-950 transition hover:bg-slate-100"
            >
              Start next lesson
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl font-black">Recently Viewed</h2>
              <Link href="/continue-learning" className="font-bold text-blue-300 hover:text-blue-200">
                View all &rarr;
              </Link>
            </div>
            <div className="mt-8 space-y-4">
              {recentlyViewed.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-blue-400"
                >
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
              AI Financial Coach
            </p>
            <h2 className="mt-4 text-3xl font-black">Ask for a next step before your next money move</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Use the coach to clarify concepts, review lesson recommendations, and turn what
              you&rsquo;re learning into practical action plans that match your current stage.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                "Explain this lesson",
                "Recommend my next course",
                "Create a practice plan",
              ].map((prompt) => (
                <div key={prompt} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  {prompt}
                </div>
              ))}
            </div>
            <Link
              href="/ai-coach"
              className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              Launch AI Coach
            </Link>
          </section>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <h2 className="text-2xl font-black">Financial Tools</h2>
            <div className="mt-6 space-y-4">
              {financialTools.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-blue-400"
                >
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <h2 className="text-2xl font-black">Saved Resources</h2>
            <div className="mt-6 space-y-4">
              {savedResources.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-blue-400"
                >
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <h2 className="text-2xl font-black">Upcoming Webinars &amp; Events</h2>
            <div className="mt-6 space-y-4">
              {upcomingEvents.map((item) => (
                <Link
                  key={`${item.title}-${item.date}`}
                  href={item.href}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-blue-400"
                >
                  <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">{item.date}</p>
                  <h3 className="mt-2 font-bold">{item.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900/80 p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
                Announcements
              </p>
              <h2 className="mt-3 text-3xl font-black">What&rsquo;s new for members</h2>
            </div>
            <Link href="/notifications" className="font-bold text-blue-300 hover:text-blue-200">
              All announcements &rarr;
            </Link>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {announcements.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
